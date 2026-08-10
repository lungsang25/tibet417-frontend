import React from 'react'
import { Link } from 'react-router-dom'
import Title from '../components/Title'
import SEO from '../components/SEO'
import { siteName, legalName, business, siteUrl } from '../config/site'

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
  const { streetAddress, postalCode, addressLocality, telephone, email } = business
  const hasAddress = streetAddress && postalCode && addressLocality

  return (
    <div>
      <SEO
        title={`Impressum | ${siteName}`}
        description={`Legal notice for ${legalName} — operator details, contact address and responsible party for ${siteUrl.replace('https://', '')}.`}
        path='/impressum'
        breadcrumb={[{ name: 'Home', path: '/' }, { name: 'Impressum' }]}
      />

      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'LEGAL'} text2={'NOTICE'} as='h1' />
      </div>

      <div className='my-10 flex flex-col gap-8 text-sm text-gray-600 max-w-4xl'>

        <div className='flex flex-col gap-3'>
          <b className='text-gray-800'>Operator of this website</b>
          <p>{legalName}</p>
          {hasAddress ? (
            <address className='not-italic'>
              {streetAddress}<br />
              {postalCode} {addressLocality}<br />
              Switzerland
            </address>
          ) : (
            /* Rendered only until the address is filled into
               src/config/site.js. Do not replace with sample data. */
            <p className='text-gray-400'>
              Postal address to be published.
            </p>
          )}
        </div>

        <div className='flex flex-col gap-3'>
          <b className='text-gray-800'>Contact</b>
          <p>
            Email: <a href={`mailto:${email}`} className='underline'>{email}</a>
            {telephone && <><br />Telephone: {telephone}</>}
          </p>
        </div>

        <div className='flex flex-col gap-3'>
          <b className='text-gray-800'>VAT</b>
          <p>As a small business, {legalName} is exempt from the obligation to charge Swiss VAT. All prices are net and stated in Swiss francs (CHF).</p>
        </div>

        <div className='flex flex-col gap-3'>
          <b className='text-gray-800'>Terms of business</b>
          <p>Our <Link to='/terms' className='underline'>General Terms and Conditions</Link> apply to all orders placed through this website. The offering is directed exclusively at consumers domiciled in Switzerland.</p>
        </div>

        <div className='flex flex-col gap-3'>
          <b className='text-gray-800'>Place of jurisdiction</b>
          <p>9000 St. Gallen, or the domicile of the consumer.</p>
        </div>

        <div className='flex flex-col gap-3'>
          <b className='text-gray-800'>Liability for content and links</b>
          <p>{legalName} accepts no liability for the currency, completeness or correctness of the content published on this website. Liability claims regarding damage caused by the use of any information provided, including information which is incomplete or incorrect, are excluded. References and links to third-party websites lie outside our area of responsibility.</p>
        </div>

      </div>
    </div>
  )
}

export default Impressum
