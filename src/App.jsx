import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import SEO from './components/SEO'
import { siteName } from './config/site'
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
 * matches robots.txt.
 */
const PRIVATE_ROUTES = {
  '/cart': 'Your Cart',
  '/login': 'Sign In',
  '/place-order': 'Checkout',
  '/orders': 'Your Orders',
  '/profile': 'Your Profile',
  '/verify': 'Verifying Payment',
  '/verify-twint': 'Verifying Payment',
}

const App = () => {
  const { pathname } = useLocation()
  const privateTitle = PRIVATE_ROUTES[pathname]

  return (
    <div className='overflow-x-clip px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      {privateTitle && (
        <SEO
          title={`${privateTitle} | ${siteName}`}
          description={`${privateTitle} — ${siteName}.`}
          path={pathname}
          noindex
        />
      )}
      <Analytics />
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        {/* Crawlable category URLs. Same component — the param pins the filter. */}
        <Route path='/collection/:categorySlug' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/terms' element={<Terms />} />
        <Route path='/impressum' element={<Impressum />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/verify-twint' element={<VerifyTwint />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
