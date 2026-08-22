import React from 'react'
import { useTranslation } from 'react-i18next'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import SEO from '../components/SEO'
import { business } from '../config/site'

const Contact = () => {
  const { t } = useTranslation('contact')
  const { streetAddress, postalCode, addressLocality, telephone, email } = business
  const hasAddress = streetAddress && postalCode && addressLocality

  return (
    <div>
      <SEO
        title={t('seo.title')}
        description={t('seo.description')}
        path='/contact'
        breadcrumb={[{ name: 'Home', path: '/' }, { name: 'Contact' }]}
      />

      <div className='text-center text-2xl pt-10 border-t'>
          <Title text1={t('heading.text1')} text2={t('heading.text2')} as='h1' />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt={t('imgAlt')} />
        <div className='flex flex-col justify-center items-start gap-6'>
          <h2 className='font-semibold text-xl text-gray-600'>{t('ourStore')}</h2>

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
              {t('switzerland')}
            </address>
          ) : (
            /* Points at email, which works, rather than at the Impressum
               for an address that is not published yet — that pairing was a
               dead end in both directions. Both pages fill themselves in from
               src/config/site.js the moment the address is set. */
            <p className='text-gray-500'>
              {t('noAddressText')}
            </p>
          )}

          <p className='text-gray-500'>
            {telephone && <>{t('telLabel')} {telephone}<br /></>}
            {t('emailLabel')} <a href={`mailto:${email}`} className='underline'>{email}</a>
          </p>
        </div>
      </div>

      <NewsletterBox/>
    </div>
  )
}

export default Contact
