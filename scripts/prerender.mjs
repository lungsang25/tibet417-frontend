/**
 * Build-time prerendering + sitemap generation.
 *
 * Why this exists
 * ───────────────
 * `vite build` emits a single index.html whose <body> is an empty
 * <div id="root"></div>. Served through the SPA rewrite in vercel.json, every
 * URL on the site returned that same 4,258-byte shell: no headings, no copy, no
 * links, no metadata. Google renders JavaScript, but only on a deferred and
 * budget-limited second pass, and Bing, Facebook, LinkedIn, Slack and WhatsApp
 * do not render it at all.
 *
 * This script loads each route in a real browser, waits for the app to fetch its
 * data and for react-helmet-async to inject the page's metadata, then writes the
 * resulting DOM to dist/<route>/index.html. Vercel resolves the filesystem
 * before applying rewrites, so those files are served directly and the rewrite
 * remains the fallback for client-side navigation.
 *
 * The output is a snapshot of exactly what a user sees — this is not serving
 * different content to crawlers.
 */

import { createServer } from 'node:http'
import { readFile, writeFile, mkdir, access, copyFile } from 'node:fs/promises'
import { join, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = join(__dirname, '..', 'dist')
const PORT = 4183
const ORIGIN = `http://127.0.0.1:${PORT}`

const SITE_URL = 'https://www.tibet417.com'
const BACKEND_URL = process.env.VITE_BACKEND_URL || 'https://tibet417-backend.vercel.app'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
}

/** Static file server that mirrors the production SPA rewrite. */
const serveDist = () =>
  new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      const urlPath = decodeURIComponent(req.url.split('?')[0])
      const candidate = join(DIST, urlPath)
      try {
        if (extname(candidate)) {
          const body = await readFile(candidate)
          res.writeHead(200, { 'Content-Type': MIME[extname(candidate)] || 'application/octet-stream' })
          return res.end(body)
        }
        throw new Error('not a file')
      } catch {
        const shell = await readFile(join(DIST, 'index.html'))
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end(shell)
      }
    })
    server.listen(PORT, '127.0.0.1', () => resolve(server))
  })

/**
 * The backend is a Vercel serverless function, so the first request after an
 * idle period can cold-start and return a non-JSON error. Observed in practice:
 * one build skipped every product route on a blip, the next succeeded. Retry
 * rather than quietly shipping a deploy with no product pages.
 */
const fetchProducts = async (attempts = 4) => {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/product/list`)
      const data = await res.json()
      if (!data?.success || !Array.isArray(data.products)) throw new Error('unexpected payload')
      return data.products
    } catch (err) {
      if (attempt === attempts) {
        console.error(`  ! could not fetch products after ${attempts} attempts (${err.message})`)
        return null
      }
      const backoff = attempt * 2000
      console.warn(`  … product fetch attempt ${attempt} failed (${err.message}); retrying in ${backoff / 1000}s`)
      await new Promise((r) => setTimeout(r, backoff))
    }
  }
}

const run = async () => {
  const products = await fetchProducts()
  if (products === null) {
    // Shipping the static pages while silently dropping every product URL would
    // leave the sitemap and the index disagreeing about what the site contains.
    console.error('Aborting: product list unavailable, so product routes and the sitemap would be incomplete.')
    process.exit(1)
  }

  // Only ship category URLs that actually have stock. An empty category page is
  // a soft 404 — Google indexes it, finds nothing, and the thin result counts
  // against the site. /collection/kids has no products at the time of writing.
  const stockedCategories = ['men', 'women', 'kids'].filter((slug) =>
    products.some((p) => p.category?.toLowerCase() === slug),
  )

  const staticRoutes = [
    { path: '/', changefreq: 'daily', priority: '1.0' },
    { path: '/collection', changefreq: 'daily', priority: '0.9' },
    ...stockedCategories.map((slug) => ({
      path: `/collection/${slug}`,
      changefreq: 'weekly',
      priority: '0.8',
    })),
    { path: '/about', changefreq: 'monthly', priority: '0.7' },
    { path: '/contact', changefreq: 'monthly', priority: '0.6' },
    { path: '/terms', changefreq: 'yearly', priority: '0.3' },
    { path: '/impressum', changefreq: 'yearly', priority: '0.3' },
  ]

  const productRoutes = products.map((p) => ({
    path: `/product/${p._id}`,
    changefreq: 'weekly',
    priority: '0.8',
    lastmod: p.date ? new Date(p.date).toISOString().slice(0, 10) : undefined,
  }))

  const routes = [...staticRoutes, ...productRoutes]

  // Preserve the untouched shell before prerendering overwrites index.html with
  // the homepage. vercel.json points its SPA fallback at this file, so routes
  // that are not prerendered (/cart, /login, an unknown product id) still boot
  // from an empty container. Falling back to the prerendered homepage instead
  // would flash homepage markup on every one of them and break hydration.
  await copyFile(join(DIST, 'index.html'), join(DIST, 'app.html'))

  const server = await serveDist()
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const failures = []

  try {
    for (const route of routes) {
      // Routes occasionally miss networkidle0 under build-machine load. One
      // retry keeps a transient blip from failing an otherwise good deploy.
      let lastError
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const kb = await snapshot(browser, route, products)
          console.log(`  ✓ ${route.path.padEnd(34)} ${kb} KB`)
          lastError = null
          break
        } catch (err) {
          lastError = err
          if (attempt === 1) console.warn(`  … ${route.path} attempt 1 failed (${err.message}); retrying`)
        }
      }
      if (lastError) {
        failures.push({ path: route.path, message: lastError.message })
        console.error(`  ✗ ${route.path.padEnd(34)} ${lastError.message}`)
      }
    }
  } finally {
    await browser.close()
    server.close()
  }

  await writeSitemap(routes.filter((r) => !failures.some((f) => f.path === r.path)))

  if (failures.length) {
    // A route that silently falls back to the empty shell is the exact problem
    // this script exists to fix, so surface it rather than shipping quietly.
    console.error(`\nPrerender failed for ${failures.length} route(s).`)
    process.exit(1)
  }
}

/** Snapshots one route to dist/<route>/index.html. Returns its size in KB. */
const snapshot = async (browser, route, products) => {
  const page = await browser.newPage()
  try {
    await page.goto(`${ORIGIN}${route.path}`, { waitUntil: 'networkidle0', timeout: 45000 })

    // networkidle0 only proves the network settled. Wait for the actual signal
    // that this route rendered: Helmet has emitted this page's canonical.
    await page.waitForFunction(
      (expected) => {
        const canonical = document.querySelector('link[rel="canonical"]')
        return canonical && new URL(canonical.href).pathname === expected
      },
      { timeout: 15000 },
      route.path,
    )

    let html = `<!doctype html>\n${await page.evaluate(() => document.documentElement.outerHTML)}`

    // Inline the catalogue this snapshot was rendered from, so the first client
    // render reproduces this exact markup instead of starting from an empty
    // product list and failing hydration. A classic inline script runs before
    // the deferred module bundle, so it is set in time.
    const preload =
      `<script>window.__TIBET417_PRODUCTS__=${JSON.stringify(products).replace(/</g, '\\u003c')}</script>`
    html = html.replace('</head>', `${preload}</head>`)

    const outDir = route.path === '/' ? DIST : join(DIST, route.path)
    await mkdir(outDir, { recursive: true })
    await writeFile(join(outDir, 'index.html'), html, 'utf8')

    return (html.length / 1024).toFixed(1)
  } finally {
    await page.close()
  }
}

const writeSitemap = async (routes) => {
  const today = new Date().toISOString().slice(0, 10)
  const body = routes
    .map((r) => [
      '  <url>',
      `    <loc>${SITE_URL}${r.path}</loc>`,
      `    <lastmod>${r.lastmod || today}</lastmod>`,
      `    <changefreq>${r.changefreq}</changefreq>`,
      `    <priority>${r.priority}</priority>`,
      '  </url>',
    ].join('\n'))
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
  await writeFile(join(DIST, 'sitemap.xml'), xml, 'utf8')
  console.log(`\n  ✓ sitemap.xml (${routes.length} URLs)`)
}

await access(DIST).catch(() => {
  console.error('dist/ not found — run `vite build` first.')
  process.exit(1)
})

console.log('\nPrerendering routes:')
await run()
