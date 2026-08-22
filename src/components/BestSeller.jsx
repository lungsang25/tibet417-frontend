import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { ShopContext } from '../context/ShopContext'
import ProductSection from './ProductSection'

const BestSeller = () => {

    const { t } = useTranslation('home');
    const { products, productsLoaded } = useContext(ShopContext);

  return (
    <ProductSection
      text1={t('sections.bestSellers.text1')}
      text2={t('sections.bestSellers.text2')}
      description={t('sections.bestSellers.description')}
      products={products.filter((item) => item.bestseller).slice(0, 4)}
      count={4}
      loading={!productsLoaded}
    />
  )
}

export default BestSeller
