/*
 * Tibet417 service worker.
 *
 * Deliberately small and conservative — this is a shop with logins, a cart and
 * card/TWINT payments, so the rule is "never serve something stale that the
 * user would act on":
 *
 *   - Only same-origin GET requests are touched. The API (a different origin),
 *     Payrexx, Google sign-in and analytics all go straight to the network.
 *   - Page navigations are network-first. The cache is only a fallback for when
 *     the network is down, so a user online always sees the current catalogue.
 *   - Cart, checkout, account and payment-return pages are never cached; when
 *     offline they show /offline.html instead of a shell that cannot work.
 *   - /assets/* files are content-hashed by Vite (a changed file gets a new
 *     name), so they are safe to serve cache-first forever.
 *
 * To change what is precached (offline.html and its icon), bump VERSION —
 * install only re-runs when this file's bytes change, and old caches are
 * deleted on activate.
 */

const VERSION = 'v1'
const PRECACHE = `tibet417-precache-${VERSION}`
const ASSETS = `tibet417-assets-${VERSION}`
const PAGES = `tibet417-pages-${VERSION}`

const OFFLINE_URL = '/offline.html'
const PRECACHE_URLS = [OFFLINE_URL, '/web-app-manifest-192x192.png']

// Hashed build output accumulates across deploys; keep the newest N entries.
const MAX_ASSETS = 150
const MAX_PAGES = 30

// Auth, cart, checkout and payment-return routes (unprefixed path after /:lang).
const PRIVATE_PAGE =
  /^\/(?:en|de|fr|it)\/(?:cart|login|place-order|orders|profile|rewards|wishlist|verify|verify-twint)(?:\/|$)/

const STATIC_FILE = /\.(?:png|jpe?g|webp|avif|svg|ico|woff2?)$/i

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      // cache: 'reload' skips the HTTP cache so a new version never precaches
      // the previous version's offline page.
      .then((cache) => cache.addAll(PRECACHE_URLS.map((url) => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  const keep = [PRECACHE, ASSETS, PAGES]
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(names.filter((n) => n.startsWith('tibet417-') && !keep.includes(n)).map((n) => caches.delete(n))),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET' || request.headers.has('range')) return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstPage(event, url))
  } else if (url.pathname.startsWith('/assets/')) {
    event.respondWith(cacheFirst(event))
  } else if (STATIC_FILE.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(event))
  }
  // Anything else (manifest, sitemap, robots.txt, ...) falls through to the network.
})

const trim = async (cacheName, max) => {
  const cache = await caches.open(cacheName)
  const keys = await cache.keys()
  await Promise.all(keys.slice(0, Math.max(0, keys.length - max)).map((key) => cache.delete(key)))
}

const networkFirstPage = async (event, url) => {
  // Keyed by path only, so /en/collection?sort=x and /en/collection share one
  // fallback entry instead of filling the cache with query variants.
  const cacheKey = new Request(url.origin + url.pathname)
  try {
    const response = await fetch(event.request)
    // response.ok is false for redirects (opaqueredirect) and errors — neither
    // is worth keeping.
    if (response.ok && !PRIVATE_PAGE.test(url.pathname)) {
      const copy = response.clone()
      event.waitUntil(
        caches
          .open(PAGES)
          .then((cache) => cache.put(cacheKey, copy))
          .then(() => trim(PAGES, MAX_PAGES)),
      )
    }
    return response
  } catch {
    const cached = await caches.match(cacheKey, { cacheName: PAGES })
    return cached || (await caches.match(OFFLINE_URL)) || Response.error()
  }
}

const cacheFirst = async (event) => {
  const cache = await caches.open(ASSETS)
  const cached = await cache.match(event.request)
  if (cached) return cached

  const response = await fetch(event.request)
  if (response.ok) {
    const copy = response.clone()
    event.waitUntil(cache.put(event.request, copy).then(() => trim(ASSETS, MAX_ASSETS)))
  }
  return response
}

const staleWhileRevalidate = async (event) => {
  const cache = await caches.open(ASSETS)
  const cached = await cache.match(event.request)
  const refresh = fetch(event.request)
    .then((response) => {
      if (response.ok) cache.put(event.request, response.clone())
      return response
    })
    .catch(() => cached || Response.error())
  event.waitUntil(refresh)
  return cached || refresh
}
