import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductSection from './ProductSection'

const BestSeller = () => {

    const { products, productsLoaded } = useContext(ShopContext);

  return (
    <ProductSection
      text1={'BEST'}
      text2={'SELLERS'}
      description={'The pieces our customers keep coming back for.'}
      products={products.filter((item) => item.bestseller).slice(0, 4)}
      count={4}
      loading={!productsLoaded}
    />
  )
}

export default BestSeller
