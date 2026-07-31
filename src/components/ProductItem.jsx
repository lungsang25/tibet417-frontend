import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import {Link} from 'react-router-dom'
import { getMediumImage } from '../utils/imageUtils'
import OptimizedImage from './OptimizedImage'

const ProductItem = ({id,image,name,price,priority = false}) => {
    
    const {currency} = useContext(ShopContext);

  return (
    <Link onClick={()=>scrollTo(0,0)} className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
      <OptimizedImage 
        src={getMediumImage(image[0])} 
        alt={name} 
        priority={priority}
        containerClassName='h-64 w-full'
        className='hover:scale-110 transition ease-in-out'
      />
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className=' text-sm font-medium'>{currency}{price}</p>
    </Link>
  )
}

export default ProductItem
