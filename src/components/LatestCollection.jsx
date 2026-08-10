import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductSection from './ProductSection'

const LatestCollection = () => {

    const { products, productsLoaded } = useContext(ShopContext);

  return (
    <ProductSection
      text1={'LATEST'}
      text2={'COLLECTIONS'}
      description={'The newest pieces to arrive in store — considered, made to last, and made in limited runs.'}
      products={products.slice(0, 8)}
      count={8}
      loading={!productsLoaded}
    />
  )
}

export default LatestCollection
