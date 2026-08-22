import React from 'react'
import { useTranslation } from 'react-i18next'

/**
 * NOTE (owner): this form is not wired to anything. onSubmitHandler only calls
 * preventDefault(), so a submitted address is discarded — nothing is stored and
 * no email is sent. It needs a backend endpoint before it should collect
 * addresses. Flagged rather than silently redesigned.
 *
 * The heading previously promised "Subscribe now & get 20% off" against a form
 * that discards the address, and the body was Lorem Ipsum — which shipped into
 * the prerendered HTML of the homepage, /about and /contact, three of the pages
 * Google leans on most to work out what this business is.
 */
const NewsletterBox = () => {
    const { t } = useTranslation('home')

    const onSubmitHandler = (event) => {
        event.preventDefault();
    }

  return (
    <div className=' text-center'>
      <p className='text-2xl font-medium text-gray-800'>{t('newsletter.heading')}</p>
      <p className='text-gray-400 mt-3'>
      {t('newsletter.text')}
      </p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
        <label htmlFor='newsletter-email' className='sr-only'>{t('newsletter.placeholder')}</label>
        <input id='newsletter-email' className='w-full sm:flex-1 outline-none' type="email" placeholder={t('newsletter.placeholder')} required/>
        <button type='submit' className='bg-black text-white text-xs px-10 py-4'>{t('newsletter.button')}</button>
      </form>
    </div>
  )
}

export default NewsletterBox
