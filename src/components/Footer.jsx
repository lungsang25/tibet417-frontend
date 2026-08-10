import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { siteName, legalName, business } from '../config/site'

// The footer is the site's most repeated internal-link block, so it is a large
// part of how Google models the hierarchy that sitelinks are drawn from. It now
// links the category pages rather than listing dead <li> text.
const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        <div>
            <img src={assets.logo} className='mb-5 w-32' alt={`${siteName} logo`} />
            <p className='w-full md:w-2/3 text-gray-600'>
            {siteName} brings authentic Tibetan and Himalayan fashion to
            Switzerland — clothing and accessories chosen for craft and
            provenance, shipped from Switzerland and priced in CHF.
            </p>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>SHOP</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li><Link to='/collection'>All products</Link></li>
                <li><Link to='/collection/men'>Men</Link></li>
                <li><Link to='/collection/women'>Women</Link></li>
                <li><Link to='/collection/kids'>Kids</Link></li>
            </ul>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/about'>About us</Link></li>
                <li><Link to='/contact'>Contact</Link></li>
                <li><Link to='/terms'>Terms &amp; Conditions</Link></li>
                <li><Link to='/impressum'>Impressum</Link></li>
            </ul>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                {business.telephone && <li>{business.telephone}</li>}
                <li><a href={`mailto:${business.email}`}>{business.email}</a></li>
            </ul>
        </div>

      </div>

        <div>
            <hr />
            <p className='py-5 text-sm text-center'>© {year} {legalName}. All rights reserved.</p>
        </div>

    </div>
  )
}

export default Footer
