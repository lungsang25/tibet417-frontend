import React from 'react'
import { socialLinks } from '../config/site'

const tiktokNote =
  'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z'

// Full-colour brand marks on a 24x24 grid, each filling the whole icon.
const socialIcons = {
  instagram: (
    <>
      <rect width='24' height='24' rx='6' fill='url(#social-instagram-gradient)' />
      <g fill='none' stroke='#fff' strokeWidth='1.8'>
        <rect x='5' y='5' width='14' height='14' rx='4' />
        <circle cx='12' cy='12' r='3.3' />
      </g>
      <circle cx='16.3' cy='7.7' r='1' fill='#fff' />
    </>
  ),
  facebook: (
    <path
      fill='#1877F2'
      d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
    />
  ),
  tiktok: (
    <>
      <rect width='24' height='24' rx='6' fill='#000' />
      <g transform='translate(5.5 5) scale(0.55)'>
        <path d={tiktokNote} fill='#25F4EE' transform='translate(-0.9 -0.9)' />
        <path d={tiktokNote} fill='#FE2C55' transform='translate(0.9 0.9)' />
        <path d={tiktokNote} fill='#fff' />
      </g>
    </>
  ),
  youtube: (
    <>
      <rect width='24' height='24' rx='6' fill='#FF0000' />
      <path d='m10 15.5 5.2-3.5L10 8.5z' fill='#fff' />
    </>
  ),
}

// Row of brand-coloured social icons, fed by socialLinks in src/config/site.js.
const SocialLinks = ({ className = '' }) => (
  <>
    {/* Shared gradient for the Instagram mark. */}
    <svg width='0' height='0' className='absolute' aria-hidden='true' focusable='false'>
      <defs>
        <linearGradient id='social-instagram-gradient' x1='0' y1='1' x2='1' y2='0'>
          <stop offset='0' stopColor='#FEDA75' />
          <stop offset='0.25' stopColor='#FA7E1E' />
          <stop offset='0.5' stopColor='#D62976' />
          <stop offset='0.75' stopColor='#962FBF' />
          <stop offset='1' stopColor='#4F5BD5' />
        </linearGradient>
      </defs>
    </svg>
  <ul className={`flex items-center gap-3 ${className}`}>
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
          className='block h-10 w-10 transition-transform hover:scale-110 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded-full'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            className='h-full w-full'
            aria-hidden='true'
          >
            {socialIcons[id]}
          </svg>
        </a>
      </li>
    ))}
  </ul>
  </>
)

export default SocialLinks
