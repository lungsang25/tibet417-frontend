import React, { useContext, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import SEO from '../components/SEO';
import { absoluteUrl } from '../config/site';
import { LocalizedLink as Link } from '../hooks/useLocalizedNavigation';

// Top-level categories get their own crawlable URL (/collection/men). Before
// this, the entire catalogue lived at a single /collection URL behind
// client-side checkboxes, so there was nothing for Google to list as a sitelink
// and no page that could rank for a category term.
//
// `value` matches the backend's product.category field (English, from the
// database) and must never be translated. Everything else is a translation
// key resolved from collection.json at render time.
const CATEGORY_VALUES = { men: 'Men', women: 'Women', kids: 'Kids' }

const Collection = () => {

  const { t } = useTranslation('collection');
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const slug = categorySlug?.toLowerCase();
  const activeCategory = slug && CATEGORY_VALUES[slug]
    ? {
        value: CATEGORY_VALUES[slug],
        heading: t(`categories.${slug}.heading`),
        titleWord: t(`categories.${slug}.titleWord`),
        title: t(`categories.${slug}.title`),
        description: t(`categories.${slug}.description`),
      }
    : null;

  const { products , productsLoaded , search , setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [showFilter,setShowFilter] = useState(false);
  const [filterProducts,setFilterProducts] = useState([]);
  const [category,setCategory] = useState([]);
  const [subCategory,setSubCategory] = useState([]);
  const [sortType,setSortType] = useState('relavent')

  // The WebSite SearchAction advertises /collection?search={term} to Google.
  // That target used to be a dead end: search lived only in React context, so
  // arriving with ?search= showed the unfiltered catalogue.
  useEffect(() => {
    const term = searchParams.get('search');
    if (term) {
      setSearch(term);
      setShowSearch(true);
    }
  }, [searchParams, setSearch, setShowSearch])

  // A category URL pins its own filter; the checkbox group is for the
  // unscoped /collection page.
  useEffect(() => {
    setCategory(activeCategory ? [activeCategory.value] : []);
  }, [categorySlug])

  const toggleCategory = (e) => {

    if (category.includes(e.target.value)) {
        setCategory(prev=> prev.filter(item => item !== e.target.value))
    }
    else{
      setCategory(prev => [...prev,e.target.value])
    }

  }

  const toggleSubCategory = (e) => {

    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev=> prev.filter(item => item !== e.target.value))
    }
    else{
      setSubCategory(prev => [...prev,e.target.value])
    }
  }

  const applyFilter = () => {

    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    if (subCategory.length > 0 ) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
    }

    setFilterProducts(productsCopy)

  }

  const sortProduct = () => {

    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a,b)=>(a.price - b.price)));
        break;

      case 'high-low':
        setFilterProducts(fpCopy.sort((a,b)=>(b.price - a.price)));
        break;

      default:
        applyFilter();
        break;
    }

  }

  useEffect(()=>{
      applyFilter();
  },[category,subCategory,search,showSearch,products])

  useEffect(()=>{
    sortProduct();
  },[sortType])

  const path = activeCategory ? `/collection/${slug}` : '/collection';
  const heading = activeCategory ? activeCategory.heading : `${t('headings.all')} ${t('headings.collections')}`;

  // A category with nothing in it is a soft 404 — Google indexes the URL, finds
  // no content, and the thin page drags on the rest of the site. /collection/kids
  // is empty today. Measured against the whole catalogue, not the filtered view,
  // so an active search box never flips a real category to noindex.
  const categoryIsEmpty =
    activeCategory && productsLoaded &&
    !products.some((item) => item.category === activeCategory.value);

  const breadcrumb = activeCategory
    ? [{ name: 'Home', path: '/' }, { name: 'Collection', path: '/collection' }, { name: activeCategory.heading }]
    : [{ name: 'Home', path: '/' }, { name: 'Collection' }];

  // ItemList gives Google an explicit, ordered manifest of what is on this page
  // and a direct crawl path to every product URL.
  const itemListNode = filterProducts.length
    ? [{
        '@type': 'ItemList',
        '@id': `${absoluteUrl(path)}#itemlist`,
        name: heading,
        numberOfItems: filterProducts.length,
        itemListElement: filterProducts.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: absoluteUrl(`/product/${item._id}`),
          name: item.name,
        })),
      }]
    : [];

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      <SEO
        title={activeCategory ? activeCategory.title : t('allProducts.title')}
        description={activeCategory ? activeCategory.description : t('allProducts.description')}
        path={path}
        noindex={categoryIsEmpty}
        breadcrumb={breadcrumb}
        extraSchemaNodes={itemListNode}
      />

      {/* Filter Options */}
      <div className='min-w-60'>
        <p onClick={()=>setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>{t('filters.label')}
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
        </p>
        {/* Category Filter — hidden on a category URL, which already pins it */}
        {!activeCategory && (
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' :'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>{t('filters.categoriesLabel')}</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Men'} onChange={toggleCategory}/> {t('filters.men')}
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Women'} onChange={toggleCategory}/> {t('filters.women')}
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Kids'} onChange={toggleCategory}/> {t('filters.kids')}
            </p>
          </div>
        </div>
        )}
        {/* SubCategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' :'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>{t('filters.typeLabel')}</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Topwear'} onChange={toggleSubCategory}/> {t('filters.topwear')}
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Bottomwear'} onChange={toggleSubCategory}/> {t('filters.bottomwear')}
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Winterwear'} onChange={toggleSubCategory}/> {t('filters.winterwear')}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className='flex-1'>

        <div className='flex justify-between text-base sm:text-2xl mb-4'>
            <Title text1={activeCategory ? activeCategory.titleWord : t('headings.all')} text2={activeCategory ? t('headings.collection') : t('headings.collections')} as='h1' />
            {/* Porduct Sort */}
            <select onChange={(e)=>setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2' aria-label='Sort products'>
              <option value="relavent">{t('sort.relevant')}</option>
              <option value="low-high">{t('sort.lowHigh')}</option>
              <option value="high-low">{t('sort.highLow')}</option>
            </select>
        </div>

        {/* Map Products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {
            filterProducts.map((item,index)=>(
              <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image} />
            ))
          }
        </div>

        {productsLoaded && filterProducts.length === 0 && (
          <p className='text-gray-500 py-10'>
            {t('empty.text')} <Link to='/collection' className='underline'>{t('empty.linkText')}</Link>.
          </p>
        )}
      </div>

    </div>
  )
}

export default Collection
