import React from 'react'
import { useTranslation } from 'react-i18next'
import Title from '../components/Title'
import SEO from '../components/SEO'
import { business, socialLinks } from '../config/site'
// Displayed at max-w-[480px]; 480/960 covers 1x/2x at that display size
// without shipping the full-resolution source (was a 1.1MB PNG).
import contact_img from '../assets/contact_img.png?w=480;960&format=avif;webp;png&quality=75&as=picture'

// Stroke-based 24x24 glyphs, drawn to match one another; they take their colour
// from the link's text colour via currentColor.
const socialIcons = {
  instagram: (
    <>
      <rect x='2' y='2' width='20' height='20' rx='5' />
      <path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' />
      <line x1='17.5' y1='6.5' x2='17.51' y2='6.5' />
    </>
  ),
  facebook: (
    <path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' />
  ),
  tiktok: <path d='M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5' />,
  youtube: (
    <>
      <path d='M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17' />
      <path d='m10 15 5-3-5-3z' />
    </>
  ),
}

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
        <picture>
          {contact_img.sources.avif && <source type='image/avif' srcSet={contact_img.sources.avif} sizes='(min-width: 768px) 480px, 100vw' />}
          {contact_img.sources.webp && <source type='image/webp' srcSet={contact_img.sources.webp} sizes='(min-width: 768px) 480px, 100vw' />}
          <img className='w-full md:max-w-[480px]' src={contact_img.img.src} alt={t('imgAlt')} loading='lazy' />
        </picture>
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

          <div className='flex flex-col gap-3'>
            <p className='text-gray-500'>{t('followUs')}</p>
            <ul className='flex items-center gap-3'>
              {socialLinks.map(({ id, name, url }) => (
                <li key={id}>
                  <a
                    href={url || '#'}
                    // Accounts that do not exist yet have an empty url: keep the
                    // icon a real link, but do not jump to the page top on click.
                    onClick={url ? undefined : (e) => e.preventDefault()}
                    target={url ? '_blank' : undefined}
                    rel={url ? 'noopener noreferrer' : undefined}
                    aria-label={name}
                    title={name}
                    className='flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition-colors hover:border-black hover:text-black focus-visible:border-black focus-visible:text-black'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      className='h-5 w-5'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      aria-hidden='true'
                    >
                      {socialIcons[id]}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
