/**
 * Google Analytics 4 (gtag.js) loader and page-view tracking.
 *
 * Why the tag is injected from JS rather than written into index.html
 * ──────────────────────────────────────────────────────────────────
 * scripts/prerender.mjs loads every route in a real Chromium instance at build
 * time. A static <script src="…googletagmanager…"> in index.html would fire one
 * page_view per route on every single deploy — a build with 8 static routes and
 * 40 products would inject 48 fake sessions from the build machine into the
 * property, and those hits cannot be deleted from GA4 once collected.
 *
 * Worse, the prerenderer's output is a serialization of the live DOM, so the
 * injected tag would be baked into each snapshot and then injected a second time
 * by the client bundle on load.
 *
 * Injecting from JS behind isEnabled() avoids both: the prerenderer is filtered
 * out by the navigator.webdriver and localhost checks, so build-time snapshots
 * stay clean and the tag is loaded exactly once, in a real user's browser.
 */

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

let loaded = false

/**
 * Tracking is deliberately skipped in three cases:
 *
 *   - no measurement ID configured, so the site runs untracked rather than
 *     erroring (this is the state of every checkout before GA4 is set up);
 *   - navigator.webdriver, which is true under Puppeteer — this is what keeps
 *     the prerender pass out of the data;
 *   - localhost / 127.0.0.1, which covers `npm run dev` and the prerenderer's
 *     own static server on 127.0.0.1:4183.
 */
const isEnabled = () => {
  if (!MEASUREMENT_ID) return false
  if (typeof window === 'undefined') return false
  if (navigator.webdriver) return false

  const { hostname } = window.location
  return hostname !== 'localhost' && hostname !== '127.0.0.1'
}

/** gtag pushes `arguments` verbatim; a rest array does not serialize the same. */
function gtag() {
  window.dataLayer.push(arguments)
}

/**
 * Loads gtag.js once. Safe to call repeatedly — React 18 StrictMode mounts
 * effects twice in development, and a second <script> would double every hit.
 */
export const initAnalytics = () => {
  if (loaded || !isEnabled()) return
  loaded = true

  window.dataLayer = window.dataLayer || []
  gtag('js', new Date())

  // send_page_view: false, because gtag's automatic page_view fires on script
  // load and then never again — it has no idea react-router changed the URL.
  // Every view, including the first, is sent by trackPageView instead, so each
  // route change produces exactly one hit and no route is counted twice.
  gtag('config', MEASUREMENT_ID, { send_page_view: false })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)
}

/** Sends one page_view for the current route. */
export const trackPageView = (path) => {
  if (!isEnabled()) return

  gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}

/**
 * Escape hatch for commerce events (add_to_cart, begin_checkout, purchase).
 * Nothing calls this yet; it exists so those events do not each have to
 * re-derive the enabled check and the dataLayer plumbing.
 */
export const trackEvent = (name, params = {}) => {
  if (!isEnabled()) return
  gtag('event', name, params)
}
