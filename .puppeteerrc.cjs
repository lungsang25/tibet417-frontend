const { join } = require('path')

/**
 * Puppeteer downloads its own Chromium (~150 MB) on install. By default that
 * lands in ~/.cache/puppeteer, which sits outside the project — Vercel does not
 * carry it between builds, and on some build images the postinstall resolves it
 * to a path the build step then cannot find, so `puppeteer.launch()` fails and
 * takes the whole deploy with it.
 *
 * Pinning the cache inside the project keeps the browser next to node_modules,
 * where Vercel's build cache can reuse it. .gitignore excludes .cache/.
 *
 * This is the fix Puppeteer documents for exactly this class of host.
 */
module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
}
