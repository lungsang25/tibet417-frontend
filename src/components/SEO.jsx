import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "Tibet417 - Premium Tibetan Shopping Online | Tibet Shopping Store",
  description = "Tibet417 is your premier destination for authentic Tibetan products and online shopping. Discover quality fashion, electronics, home essentials and more. Shop Tibet417 today!",
  keywords = "tibet shopping, tibet417, tibetan shopping online, tibetan products, tibet online store, tibetan fashion, tibetan goods, buy tibetan products, tibet e-commerce, authentic tibetan shopping",
  canonical = "https://www.tibet417.com/",
  ogType = "website",
  ogImage = "https://www.tibet417.com/og-image.jpg",
  structuredData = null
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Tibet417" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
