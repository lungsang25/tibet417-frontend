import React from 'react'
import { Link } from 'react-router-dom'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import SEO from '../components/SEO'
import { siteName, business } from '../config/site'

const Contact = () => {
  const { streetAddress, postalCode, addressLocality, telephone, email } = business
  const hasAddress = streetAddress && postalCode && addressLocality

  return (
    <div>
      <SEO
        title={`Contact ${siteName} | Customer Support`}
        description={`Get in touch with ${siteName}. Questions about an order, delivery within Switzerland, returns or our Tibetan and Himalayan collection — we're happy to help.`}
        path='/contact'
        breadcrumb={[{ name: 'Home', path: '/' }, { name: 'Contact' }]}
      />

      <div className='text-center text-2xl pt-10 border-t'>
          <Title text1={'CONTACT'} text2={'US'} as='h1' />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt={`${siteName} customer support`} />
        <div className='flex flex-col justify-center items-start gap-6'>
          <h2 className='font-semibold text-xl text-gray-600'>Our Store</h2>

          {/*
            This block previously printed Faker.js template data — "54709 Willms
            Station, Suite 350, Washington, USA" and "Tel: (415) 555-0132".
            Google indexed those as facts and still repeats them in its AI
            Overview for tibet417.com, which is why the site reads as a US
            storefront despite selling exclusively into Switzerland.

            The address now comes from src/config/site.js and is omitted entirely
            until it is filled in. Showing nothing is correct; showing something
            invented is what created the problem.
          */}
          {hasAddress ? (
            <address className='text-gray-500 not-italic'>
              {streetAddress}<br />
              {postalCode} {addressLocality}<br />
              Switzerland
            </address>
          ) : (
            <p className='text-gray-500'>
              We ship to customers domiciled in Switzerland. Our full postal
              address is listed in our <Link to='/impressum' className='underline'>Impressum</Link>.
            </p>
          )}

          <p className='text-gray-500'>
            {telephone && <>Tel: {telephone}<br /></>}
            Email: <a href={`mailto:${email}`} className='underline'>{email}</a>
          </p>
        </div>
      </div>

      <NewsletterBox/>
    </div>
  )
}

export default Contact
