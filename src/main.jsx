import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ShopContextProvider from './context/ShopContext.jsx'
import { HelmetProvider } from 'react-helmet-async'

const container = document.getElementById('root')

const tree = (
  <HelmetProvider>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <ShopContextProvider>
          <App />
        </ShopContextProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </HelmetProvider>
)

// Client render, deliberately — not hydrateRoot.
//
// scripts/prerender.mjs produces its HTML by serializing a real browser DOM, and
// that loses information hydration depends on. React marks the boundary between
// adjacent text children — `<p>{siteName} exists to bring…</p>` is two text
// nodes, not one — with <!-- --> separators during true server rendering. A DOM
// snapshot has no separators, so the browser reparses those siblings as a single
// merged text node and hydration mismatches on essentially every page that
// interpolates a value into a sentence.
//
// React's response to a mismatch is to discard the markup and client-render
// anyway, so hydrateRoot bought nothing here except console errors and a wasted
// pass. Crawlers read the prerendered HTML, which is the point of the exercise;
// users get the same DOM either way, painted from the snapshot first and then
// rendered from window.__TIBET417_PRODUCTS__ without another API round-trip.
ReactDOM.createRoot(container).render(tree)
