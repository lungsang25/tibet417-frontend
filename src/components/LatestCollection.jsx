import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { ShopContext } from '../context/ShopContext'
import ProductSection from './ProductSection'

const LatestCollection = () => {

    const { t } = useTranslation('home');
    const { products, productsLoaded } = useContext(ShopContext);

  return (
    <ProductSection
      text1={t('sections.latest.text1')}
      text2={t('sections.latest.text2')}
      description={t('sections.latest.description')}
      products={products.slice(0, 8)}
      count={8}
      loading={!productsLoaded}
    />
  )
}

export default LatestCollection
