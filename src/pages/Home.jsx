import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import SEO from '../components/SEO'

const Home = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Tibet417",
    "description": "Tibet417 - Your premier destination for authentic Tibetan shopping online. Shop quality products including fashion, electronics, and home essentials.",
    "url": "https://www.tibet417.com/",
    "logo": "https://www.tibet417.com/logo.png",
    "image": "https://www.tibet417.com/og-image.jpg",
    "priceRange": "$$",
    "telephone": "+1-XXX-XXX-XXXX",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  return (
    <div>
      <SEO 
        title="Tibet417 - Premium Tibetan Shopping Online | Tibet Shopping Store"
        description="Discover Tibet417, your premier destination for authentic Tibetan shopping online. Shop quality fashion, electronics, home essentials and more. Best Tibet shopping experience with fast delivery and exceptional service."
        keywords="tibet shopping, tibet417, tibetan shopping online, tibetan products, tibet online store, buy tibetan products, tibetan fashion, tibetan goods, tibet e-commerce, authentic tibetan shopping, shop tibet, tibetan marketplace"
        canonical="https://www.tibet417.com/"
        structuredData={structuredData}
      />
      <Hero />
      <LatestCollection/>
      <BestSeller/>
      <OurPolicy/>
      <NewsletterBox/>
    </div>
  )
}

export default Home
