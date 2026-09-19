import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { ShopContext } from '../context/ShopContext'
import { isUnderPriceLimit, UNDER_PRICE_SLUG } from '../utils/priceCollections'
import ProductSection from './ProductSection'

const UnderThirty = () => {

    const { t } = useTranslation('home');
    const { products, productsLoaded } = useContext(ShopContext);

  return (
    <ProductSection
      text1={t('sections.underThirty.text1')}
      text2={t('sections.underThirty.text2')}
      description={t('sections.underThirty.description')}
      products={products.filter(isUnderPriceLimit).slice(0, 4)}
      count={4}
      href={`/collection/${UNDER_PRICE_SLUG}`}
      loading={!productsLoaded}
    />
  )
}

export default UnderThirty
