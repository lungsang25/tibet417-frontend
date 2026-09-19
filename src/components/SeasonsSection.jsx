import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ShopContext } from '../context/ShopContext'
import { LocalizedLink as Link } from '../hooks/useLocalizedNavigation'
import Title from './Title'
import OptimizedImage from './OptimizedImage'
import { getOptimizedImage, getSrcSet } from '../utils/imageUtils'
import { SEASON_SLUGS, getCurrentSeason, hasSeason } from '../utils/seasons'

const TILE_SIZES = '(min-width: 1024px) 23vw, 47vw'

const SeasonTileSkeleton = () => <div className='aspect-[3/4] w-full bg-line animate-pulse' />

/**
 * "Shop by season" — one photo tile per season that has tagged products. The
 * photo is the newest tagged product's first image, so it needs no assets of
 * its own. The tile for the current season is flagged.
 */
const SeasonsSection = () => {
  const { t } = useTranslation('home')
  const { products, productsLoaded } = useContext(ShopContext)
  const currentSeason = getCurrentSeason()

  // `products` is already newest-first, so the first match is the newest.
  const seasons = useMemo(
    () =>
      SEASON_SLUGS.map((slug) => ({ slug, cover: products.find((product) => hasSeason(product, slug)) }))
        .filter(({ cover }) => cover?.image?.[0]),
    [products]
  )

  if (productsLoaded && seasons.length === 0) return null

  return (
    <section className='py-12 sm:py-16'>
      <div className='border-b border-line pb-5'>
        <div className='text-2xl sm:text-3xl'>
          <Title text1={t('sections.seasons.text1')} text2={t('sections.seasons.text2')} />
        </div>
        <p className='max-w-xl text-sm text-stone'>{t('sections.seasons.description')}</p>
      </div>

      <div className='mt-10 grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-6'>
        {!productsLoaded
          ? SEASON_SLUGS.map((slug) => <SeasonTileSkeleton key={slug} />)
          : seasons.map(({ slug, cover }, index) => (
              <Link
                key={slug}
                to={`/collection/${slug}`}
                onClick={() => scrollTo(0, 0)}
                className='group relative block aspect-[3/4] w-full overflow-hidden bg-line'
              >
                <div className='absolute inset-0'>
                  <OptimizedImage
                    src={getOptimizedImage(cover.image[0], { width: 600, height: 800 })}
                    srcSet={getSrcSet(cover.image[0], [240, 400, 600, 800], 4 / 3)}
                    sizes={TILE_SIZES}
                    alt=''
                    priority={index < 2}
                    containerClassName='w-full h-full'
                    className='transition-transform duration-700 ease-out group-hover:scale-[1.04]'
                  />
                </div>
                <div className='absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent' />

                {slug === currentSeason && (
                  <span className='absolute top-3 left-3 bg-white/95 text-ink px-2.5 py-1 text-[10px] uppercase tracking-label'>
                    {t('sections.seasons.inSeason')}
                  </span>
                )}

                <div className='absolute bottom-0 left-0 right-0 p-4 text-paper'>
                  <p className='font-display text-2xl'>{t(`collection:categories.${slug}.titleWord`)}</p>
                  <p className='mt-1 text-[11px] uppercase tracking-label'>{t('sections.seasons.cta')}</p>
                </div>
              </Link>
            ))}
      </div>
    </section>
  )
}

export default SeasonsSection
