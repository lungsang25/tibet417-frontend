import React from 'react'
import { useTranslation } from 'react-i18next'
import { LocalizedLink as Link } from '../hooks/useLocalizedNavigation'
import Title from '../components/Title'
import SEO from '../components/SEO'
import { legalName, business } from '../config/site'

/**
 * Legal notice (Impressum).
 *
 * The GTC direct customers here five separate times — for defect notices,
 * returns, the return address and withdrawal declarations — but no such page
 * existed, so every one of those clauses pointed nowhere. A Swiss webshop is
 * expected to publish one, and it is also a strong trust signal for the brand
 * entity Google has not yet resolved.
 */
const Impressum = () => {
  const { t, i18n } = useTranslation('impressum')
  const { streetAddress, postalCode, addressLocality, telephone, email } = business
  const hasAddress = streetAddress && postalCode && addressLocality

  return (
    <div>
      <SEO
        title={t('seo.title')}
        description={t('seo.description')}
        path='/impressum'
        breadcrumb={[{ name: 'Home', path: '/' }, { name: 'Impressum' }]}
      />

      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={t('heading.text1')} text2={t('heading.text2')} as='h1' />
      </div>

      <div className='my-10 flex flex-col gap-8 text-sm text-gray-600 max-w-4xl'>

        {i18n.language !== 'en' && (
          <div className='border-l-2 border-gray-300 pl-4'>
            <p>{t('aiDisclaimer')}</p>
          </div>
        )}

        <div className='flex flex-col gap-3'>
          <b className='text-gray-800'>{t('operator.label')}</b>
          <p>{legalName}</p>
          {hasAddress ? (
            <address className='not-italic'>
              {streetAddress}<br />
              {postalCode} {addressLocality}<br />
              {t('operator.switzerland')}
            </address>
          ) : (
            /* Rendered only until the address is filled into
               src/config/site.js. Do not replace with sample data — invented
               details here are what led Google to describe this business as
               being in Washington, USA. */
            <p className='text-gray-500'>
              {t('operator.noAddressText', { email })}
            </p>
          )}
        </div>

        <div className='flex flex-col gap-3'>
          <b className='text-gray-800'>{t('contact.label')}</b>
          <p>
            {t('contact.emailPrefix')}<a href={`mailto:${email}`} className='underline'>{email}</a>
            {telephone && <><br />{t('contact.telephonePrefix')}{telephone}</>}
          </p>
        </div>

        <div className='flex flex-col gap-3'>
          <b className='text-gray-800'>{t('vat.label')}</b>
          <p>{t('vat.text', { legalName })}</p>
        </div>

        <div className='flex flex-col gap-3'>
          <b className='text-gray-800'>{t('termsOfBusiness.label')}</b>
          <p>{t('termsOfBusiness.prefix')}<Link to='/terms' className='underline'>{t('termsOfBusiness.link')}</Link>{t('termsOfBusiness.suffix')}</p>
        </div>

        <div className='flex flex-col gap-3'>
          <b className='text-gray-800'>{t('jurisdiction.label')}</b>
          <p>{t('jurisdiction.text')}</p>
        </div>

        <div className='flex flex-col gap-3'>
          <b className='text-gray-800'>{t('liability.label')}</b>
          <p>{t('liability.text', { legalName })}</p>
        </div>

      </div>
    </div>
  )
}

export default Impressum
