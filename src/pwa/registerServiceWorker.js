import { isPrerenderBrowser } from './env'

// Production only: in `vite dev` a service worker would cache modules that
// change on every save. See public/sw.js for what it does and does not cache.
export const registerServiceWorker = () => {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator) || isPrerenderBrowser()) return

  const register = () => navigator.serviceWorker.register('/sw.js').catch(() => {
    // Registration failing (private mode, blocked storage) only costs offline
    // support — never worth surfacing to a shopper.
  })

  // After load, so registration never competes with the page's own requests.
  if (document.readyState === 'complete') register()
  else window.addEventListener('load', register, { once: true })
}
