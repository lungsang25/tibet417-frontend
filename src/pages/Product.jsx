import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShopContext } from '../context/ShopContext';
import RelatedProducts from '../components/RelatedProducts';
import { getLargeImage, getMediumImage } from '../utils/imageUtils';
import SEO from '../components/SEO';
import { currencyCode, absoluteUrl, siteName } from '../config/site';
import { LocalizedLink as Link } from '../hooks/useLocalizedNavigation';

const Product = () => {

  const { t } = useTranslation('product');
  const { productId } = useParams();
  const { products, currency ,addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [size,setSize] = useState('')

  const fetchProductData = async () => {

    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        return null;
      }
    })

  }

  useEffect(() => {
    fetchProductData();
  }, [productId,products])

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <SEO
        title={`${productData.name} | ${siteName}`}
        description={`${productData.description.slice(0, 155)}${productData.description.length > 155 ? '…' : ''}`}
        path={`/product/${productData._id}`}
        ogType="product"
        ogImage={productData.image[0]}
        breadcrumb={[
          { name: 'Home', path: '/' },
          { name: 'Collection', path: '/collection' },
          { name: productData.category, path: `/collection/${productData.category.toLowerCase()}` },
          { name: productData.name },
        ]}
        extraSchemaNodes={[
          {
            '@type': 'Product',
            '@id': `${absoluteUrl(`/product/${productData._id}`)}#product`,
            name: productData.name,
            image: productData.image,
            description: productData.description,
            sku: productData._id,
            category: `${productData.category} / ${productData.subCategory}`,
            brand: { '@type': 'Brand', name: siteName },
            offers: {
              '@type': 'Offer',
              url: absoluteUrl(`/product/${productData._id}`),
              // Matches what Payrexx actually charges (orderController.js) and
              // what the GTC state. This said USD while the checkout billed CHF.
              priceCurrency: currencyCode,
              price: productData.price,
              availability: 'https://schema.org/InStock',
              itemCondition: 'https://schema.org/NewCondition',
              eligibleRegion: { '@type': 'Country', name: 'CH' },
            },
            // No aggregateRating: there is no review system behind these
            // products. The hardcoded 4 / 122 that used to sit here was
            // identical on every product and violates Google's structured data
            // policy on fabricated reviews. Re-add only when real, verifiable
            // customer reviews exist.
          },
        ]}
      />
      {/*----------- Product Data-------------- */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/*---------- Product Images------------- */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
              {
                productData.image.map((item,index)=>(
                  <img onClick={()=>setImage(item)} src={getMediumImage(item)} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt={t('imgAltView', { name: productData.name, index: index + 1 })} loading='lazy' />
                ))
              }
          </div>
          <div className='w-full sm:w-[80%]'>
              <img className='w-full h-auto' src={getLargeImage(image)} alt={productData.name} />
          </div>
        </div>

        {/* -------- Product Info ---------- */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <p className='mt-5 text-3xl font-medium'>{currency} {productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
              <p>{t('selectSize')}</p>
              <div className='flex gap-2'>
                {productData.sizes.map((item,index)=>(
                  <button onClick={()=>setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`} key={index}>{item}</button>
                ))}
              </div>
          </div>
          <button onClick={()=>addToCart(productData._id,size)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>{t('common:actions.addToCart')}</button>
          <hr className='mt-8 sm:w-4/5' />
          {/* Claims here must match the GTC: 10 calendar days of withdrawal
              (clause 8), delivery within Switzerland, prices net in CHF. The
              previous copy promised cash on delivery, which is not an offered
              payment method, and a 7-day return window the GTC do not grant. */}
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
              <p>{t('shippingNote')}</p>
              <p>{t('vatNote')}</p>
              <p>{t('withdrawalNotePrefix')}<Link to='/terms' className='underline'>{t('termsLink')}</Link>{t('withdrawalNoteSuffix')}</p>
          </div>
        </div>
      </div>

      {/* ---------- Description ------------- */}
      {/* The "Reviews (122)" tab is gone along with the fake rating it counted.
          The body here used to be generic filler explaining what an e-commerce
          website is — duplicated verbatim across every product, which is exactly
          the thin, templated content that keeps product pages out of the index. */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>{t('descriptionTab')}</b>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>{productData.description}</p>
          <p>{productData.category} · {productData.subCategory}</p>
        </div>
      </div>

      {/* --------- display related products ---------- */}

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

    </div>
  ) : <div className=' opacity-0'></div>
}

export default Product
