import React from 'react'
import { useTranslation } from 'react-i18next'
import { formatPrice } from '../utils/sale'

/**
 * A price, or — while the product is in a sale — the sale price followed by the
 * struck-through regular one. Renders inline (a fragment plus spans), so the
 * caller keeps control of the surrounding element and its size and colour.
 *
 * `originalPrice` is null when the product isn't on sale, which renders the
 * price exactly as it always was. `space` matches the two existing styles:
 * "CHF50" on cards and the cart, "CHF 50" on the product page.
 */
const PriceTag = ({ currency, price, originalPrice = null, space = false, originalClassName = '' }) => {
  const { t } = useTranslation()
  const gap = space ? ' ' : ''

  if (originalPrice === null) {
    return <>{currency}{gap}{price}</>
  }

  return (
    <>
      <span className='text-ink'>{currency}{gap}{formatPrice(price)}</span>
      {' '}
      {/* <s>, not a CSS line-through, so it is announced as "no longer
          accurate"; the sr-only label says what the struck price was. */}
      <s className={`ml-1.5 text-stone font-normal ${originalClassName}`}>
        <span className='sr-only'>{t('common:sale.was')} </span>
        {currency}{gap}{formatPrice(originalPrice)}
      </s>
    </>
  )
}

export default PriceTag
