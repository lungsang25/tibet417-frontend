import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SEO from './components/SEO'
import { siteName } from './config/site'
import LocaleLayout, { RootRedirect, LegacyRedirect } from './components/LocaleLayout'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Terms from './pages/Terms'
import Impressum from './pages/Impressum'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import Analytics from './components/Analytics'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify'
import VerifyTwint from './pages/VerifyTwint'

/**
 * Routes behind auth or mid-checkout. None of these pages rendered any metadata
 * of their own, so each inherited the shell's canonical and told Google it was
 * the homepage — seven URLs all claiming to be https://www.tibet417.com/.
 *
 * Handled centrally rather than in each page so the list stays in one place and
 * matches robots.txt. Keyed by the unprefixed path — the leading /:lang segment
 * is stripped before matching.
 */
const PRIVATE_ROUTE_TITLES = {
  '/cart': (t) => `${t('cart:heading.text1')} ${t('cart:heading.text2')}`,
  '/login': (t) => t('account:login.loginHeading'),
  '/place-order': (t) => `${t('checkout:deliveryInfo.text1')} ${t('checkout:deliveryInfo.text2')}`,
  '/orders': (t) => `${t('account:orders.heading.text1')} ${t('account:orders.heading.text2')}`,
  '/profile': (t) => t('common:profileMenu.myProfile'),
  '/verify': (t) => t('account:verify.twintVerifying'),
  '/verify-twint': (t) => t('account:verify.twintVerifying'),
}

const App = () => {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  // Strip the leading /:lang segment ('/de/cart' -> '/cart') before matching.
  const pathWithoutLang = '/' + pathname.split('/').slice(2).join('/')
  const privateTitleFn = PRIVATE_ROUTE_TITLES[pathWithoutLang]
  const privateTitle = privateTitleFn ? privateTitleFn(t) : null

  return (
    <div className='overflow-x-clip px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      {privateTitle && (
        <SEO
          title={`${privateTitle} | ${siteName}`}
          description={`${privateTitle} — ${siteName}.`}
          path={pathWithoutLang}
          noindex
        />
      )}
      <Analytics />
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path='/' element={<RootRedirect />} />
        <Route path='/:lang' element={<LocaleLayout />}>
          <Route index element={<Home />} />
          <Route path='collection' element={<Collection />} />
          {/* Crawlable category URLs. Same component — the param pins the filter. */}
          <Route path='collection/:categorySlug' element={<Collection />} />
          <Route path='about' element={<About />} />
          <Route path='contact' element={<Contact />} />
          <Route path='terms' element={<Terms />} />
          <Route path='impressum' element={<Impressum />} />
          <Route path='product/:productId' element={<Product />} />
          <Route path='cart' element={<Cart />} />
          <Route path='login' element={<Login />} />
          <Route path='place-order' element={<PlaceOrder />} />
          <Route path='orders' element={<Orders />} />
          <Route path='profile' element={<Profile />} />
          <Route path='verify' element={<Verify />} />
          <Route path='verify-twint' element={<VerifyTwint />} />
        </Route>
        {/* Pre-migration URLs with more than one segment (/collection/men,
            /product/<id>) — they don't match '/:lang' at all. Single-segment
            legacy URLs (/about, /cart, ...) are caught inside LocaleLayout
            instead, since they do match '/:lang' (with lang="about" etc). */}
        <Route path='*' element={<LegacyRedirect />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
