import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { ShopContext } from '../context/ShopContext'
import ProductSection from './ProductSection'
import SaleCountdown from './SaleCountdown'

/**
 * Homepage rail for the running sale. Renders nothing unless the backend says
 * a sale is live, so before it starts and after an admin ends it the homepage
 * is exactly as it was.
 *
 * Every sale product is listed (no cap): unlike the other rails there is no
 * "view all" page behind this one, so a cap would hide products.
 */
const SaleSection = () => {
  const { t } = useTranslation('home')
  const { products, productsLoaded, sale } = useContext(ShopContext)

  if (!sale?.active) return null

  return (
    <ProductSection
      text1={t('sections.sale.text1')}
      text2={t('sections.sale.text2', { percent: sale.percentOff })}
      description={<SaleCountdown />}
      products={products.filter((product) => sale.productIds.has(product._id))}
      count={4}
      showLink={false}
      loading={!productsLoaded}
    />
  )
}

export default SaleSection
