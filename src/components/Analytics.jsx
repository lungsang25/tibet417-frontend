import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { initAnalytics, trackPageView } from '../utils/analytics'

/**
 * Sends one GA4 page_view per route change. Renders nothing.
 *
 * Must live inside <BrowserRouter> (it reads useLocation) — it is mounted in
 * App, alongside Navbar.
 *
 * The send is deferred by a frame rather than fired directly in the effect.
 * Titles come from react-helmet-async, which writes document.title in its own
 * effect; reading it synchronously here reports the *previous* page's title on
 * every navigation. Waiting one macrotask lets Helmet flush first. The timer is
 * cleared on cleanup, so a visitor clicking through three links quickly sends
 * hits for what they actually landed on rather than a burst of stale ones.
 */
const Analytics = () => {
  const { pathname, search } = useLocation()

  useEffect(() => {
    initAnalytics()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => trackPageView(`${pathname}${search}`), 0)
    return () => clearTimeout(timer)
  }, [pathname, search])

  return null
}

export default Analytics
