import React, { useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import OptimizedImage from './OptimizedImage'
import LookModal from './LookModal'
import { getOptimizedImage, getSrcSet } from '../utils/imageUtils'

const MAX_LOOKS = 8
const TILE_SIZES = '(min-width: 1024px) 23vw, (min-width: 640px) 30vw, 47vw'

const LookTileSkeleton = () => <div className='aspect-[3/4] w-full bg-line animate-pulse' />

/**
 * "Dive into Style" — model photos wearing store clothes. Each photo opens a
 * popup listing the tagged products, which are ordinary product cards.
 */
const StyleSection = () => {
  const { t } = useTranslation('home')
  const { products, productsLoaded, backendUrl } = useContext(ShopContext)
  const [rawLooks, setRawLooks] = useState(null)
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    let cancelled = false
    axios
      .get(backendUrl + '/api/look/list')
      .then((response) => {
        if (!cancelled) setRawLooks(response.data.success ? response.data.looks : [])
      })
      .catch(() => {
        if (!cancelled) setRawLooks([])
      })
    return () => {
      cancelled = true
    }
  }, [backendUrl])

  // Product ids are resolved against the live catalogue. Ids of products that
  // were deleted since the look was tagged are dropped, and a look left with
  // nothing to buy is hidden rather than opening an empty popup.
  const looks = useMemo(() => {
    if (rawLooks === null || !productsLoaded) return null
    const byId = new Map(products.map((product) => [product._id, product]))
    return rawLooks
      .map((look) => ({ ...look, items: look.products.map((id) => byId.get(id)).filter(Boolean) }))
      .filter((look) => look.items.length > 0)
      .slice(0, MAX_LOOKS)
  }, [rawLooks, products, productsLoaded])

  const loading = looks === null
  if (!loading && looks.length === 0) return null

  const activeLook = looks?.find((look) => look._id === activeId) ?? null

  return (
    <section className='py-12 sm:py-16'>
      <div className='border-b border-line pb-5'>
        <div className='text-2xl sm:text-3xl'>
          <Title text1={t('sections.style.text1')} text2={t('sections.style.text2')} />
        </div>
        <p className='max-w-xl text-sm text-stone'>{t('sections.style.description')}</p>
      </div>

      <div className='mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10'>
        {loading
          ? Array.from({ length: 4 }).map((_, index) => <LookTileSkeleton key={index} />)
          : looks.map((look, index) => (
              <button
                key={look._id}
                type='button'
                onClick={() => setActiveId(look._id)}
                aria-haspopup='dialog'
                className='group block text-left'
              >
                <div className='relative aspect-[3/4] w-full overflow-hidden bg-line'>
                  <OptimizedImage
                    src={getOptimizedImage(look.image, { width: 800, height: 1200 })}
                    srcSet={getSrcSet(look.image, [240, 400, 600, 800], 1.5)}
                    sizes={TILE_SIZES}
                    alt={look.title || t('sections.style.alt')}
                    priority={index < 4}
                    containerClassName='w-full h-full'
                    className='transition-transform duration-700 ease-out group-hover:scale-[1.04]'
                  />
                </div>
                <p className='pt-3 text-[11px] uppercase tracking-label text-ink border-b border-transparent group-hover:text-stone transition-colors duration-300'>
                  {look.title || t('sections.style.cta')}
                </p>
              </button>
            ))}
      </div>

      <LookModal look={activeLook} onClose={() => setActiveId(null)} />
    </section>
  )
}

export default StyleSection
