import React from 'react'
import { socialLinks } from '../config/site'

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

// Row of round social icons, fed by socialLinks in src/config/site.js.
const SocialLinks = ({ className = '' }) => (
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
)

export default SocialLinks
