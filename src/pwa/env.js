// Small environment checks shared by the PWA modules. All are safe to call
// where `window`/`navigator` are missing.

/** True when running as an installed app (Android/desktop display-mode, or iOS's navigator.standalone). */
export const isStandalone = () =>
  typeof window !== 'undefined' &&
  (Boolean(window.matchMedia?.('(display-mode: standalone)').matches) || window.navigator.standalone === true)

/**
 * scripts/prerender.mjs snapshots pages in headless Chromium. Install prompts
 * and the service worker have no business there — the former would end up
 * baked into the HTML, the latter adds moving parts to a build step.
 */
export const isPrerenderBrowser = () =>
  typeof navigator !== 'undefined' && /HeadlessChrome/.test(navigator.userAgent)

/**
 * iOS Safari specifically — the only iOS browser this app shows manual
 * "Add to Home Screen" steps for. In-app browsers (Facebook, Instagram, ...)
 * and iOS Chrome/Firefox/Edge have different share menus or none at all.
 * iPadOS 13+ reports itself as a Mac, hence the touch-points check.
 */
export const isIosSafari = () => {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const isIos = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  return isIos && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|FBAN|FBAV|Instagram|Line\//.test(ua)
}
