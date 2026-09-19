import React from 'react'
import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import ProductItem from './ProductItem'
import OptimizedImage from './OptimizedImage'
import { getOptimizedImage, getSrcSet } from '../utils/imageUtils'
import { getProductBadge } from '../utils/productBadges'

const PHOTO_SIZES = '(min-width: 768px) 40vw, 90vw'

const LookModal = ({ look, onClose }) => {
  const { t } = useTranslation('home')
  const titleId = 'look-modal-title'

  if (!look) return null

  return (
    <Modal isOpen onClose={onClose} titleId={titleId} className='w-full max-w-4xl'>
      <button
        type='button'
        onClick={onClose}
        aria-label={t('sections.style.close')}
        className='absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-xl leading-none text-ink hover:bg-white'
      >
        ×
      </button>

      <div className='grid gap-6 p-4 sm:p-6 md:grid-cols-[2fr_3fr]'>
        <div className='aspect-[3/4] w-full bg-line'>
          <OptimizedImage
            src={getOptimizedImage(look.image, { width: 1000, height: 1500 })}
            srcSet={getSrcSet(look.image, [400, 600, 800, 1000], 1.5)}
            sizes={PHOTO_SIZES}
            alt={look.title || t('sections.style.alt')}
            priority
            containerClassName='w-full h-full'
          />
        </div>

        <div>
          <h3 id={titleId} className='mb-1 text-[11px] uppercase tracking-label text-stone'>
            {t('sections.style.modalTitle')}
          </h3>
          {look.title && <p className='mb-5 font-display text-xl text-ink'>{look.title}</p>}

          <div className='mt-4 grid grid-cols-2 gap-x-4 gap-y-8'>
            {look.items.map((item) => (
              <ProductItem
                key={item._id}
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
                sizes={item.sizes}
                badge={getProductBadge(item, t)}
              />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default LookModal
