import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import SEO from '../components/SEO'
import { siteName, legalName } from '../config/site'

/**
 * This page is one of Google's main sources for understanding what "Tibet417"
 * actually is — and, alongside the category pages, a prime sitelink candidate.
 *
 * It previously ran generic storefront-template copy ("born out of a passion for
 * innovation… from fashion and beauty to electronics and home essentials") that
 * never mentioned Tibet, the Himalayas or Switzerland. It described no business
 * in particular, which is part of why the brand token "tibet417" resolves to a
 * rug SKU rather than to this shop.
 *
 * The copy below is grounded only in what the GTC and manifest already state.
 * TODO (owner): add the real founding story — who started it, when, and the
 * sourcing relationships behind the collection. Specifics are what make an
 * About page carry entity weight; nothing here has been invented to fill space.
 */
const About = () => {
  return (
    <div>
      <SEO
        title={`About ${siteName} | Tibetan & Himalayan Fashion in Switzerland`}
        description={`${legalName} brings authentic Tibetan and Himalayan clothing and accessories to customers in Switzerland. Learn who we are and how we source our collection.`}
        path='/about'
        breadcrumb={[{ name: 'Home', path: '/' }, { name: 'About' }]}
      />

      <div className='text-2xl text-center pt-8 border-t'>
          <Title text1={'ABOUT'} text2={'US'} as='h1' />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px]' src={assets.about_img} alt={`${siteName} Tibetan and Himalayan collection`} />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
              <p>{siteName} exists to bring Tibetan and Himalayan craft to people living in Switzerland. We work with clothing and accessories rooted in Himalayan making traditions — pieces chosen for their material, their construction and where they come from, rather than for how quickly they can be produced.</p>
              <p>We are a small Swiss business. Our offering is directed at customers domiciled in Switzerland, prices are stated net in Swiss francs, and orders are dispatched from Switzerland by post or courier.</p>
              <b className='text-gray-800'>Our Mission</b>
              <p>To make Himalayan design available here without flattening what makes it worth having: honest provenance, clear pricing, and a shop small enough to answer for every piece it sells.</p>
          </div>
      </div>

      <div className=' text-xl py-4'>
          <Title text1={'WHY'} text2={'CHOOSE US'} as='h2' />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Provenance:</b>
            <p className=' text-gray-600'>Our collection is drawn from Tibetan and Himalayan making traditions, and we are direct about where a piece comes from.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Swiss delivery:</b>
            <p className=' text-gray-600'>Orders are dispatched within Switzerland by post or courier, with prices net in CHF and no VAT added.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>A 10-day right of withdrawal:</b>
            <p className=' text-gray-600'>You have ten calendar days after receipt to withdraw from your purchase, no reasons required, as set out in our Terms.</p>
          </div>
      </div>

      <NewsletterBox/>

    </div>
  )
}

export default About
