// Sale pricing helpers. Kept free of JSX and path aliases, like seasons.js.
//
// The sale itself (which products, what percentage, when the next step is) is
// decided by the backend — see tibet417-backend/utils/salePricing.js — and
// arrives through GET /api/sale/current. All that lives here is turning that
// into a price.

/**
 * Must round exactly like the backend's applySalePercent, or the price shown
 * would not be the price charged: whole cents, half up, done in integer cents
 * because 19.90 * 0.75 is 14.924999… in floating point.
 */
export const applySalePercent = (price, percentOff) => {
  const cents = Math.round(price * 100)
  return Math.round((cents * (100 - percentOff)) / 100) / 100
}

/**
 * What a product costs right now. `sale` is the ShopContext sale state (or
 * null): `{ active, percentOff, productIds: Set }`.
 */
export const getEffectivePrice = (productId, basePrice, sale) => {
  if (!sale?.active || !sale.productIds.has(productId)) {
    return { price: basePrice, originalPrice: null, percentOff: 0 }
  }
  return {
    price: applySalePercent(basePrice, sale.percentOff),
    originalPrice: basePrice,
    percentOff: sale.percentOff,
  }
}

/** "50" for whole francs, "14.93" otherwise — matches how prices already read. */
export const formatPrice = (amount) =>
  Number.isInteger(amount) ? String(amount) : amount.toFixed(2)

/** Server clock "now", so a wrong device clock can't skew the countdown. */
export const serverNow = (sale) => Date.now() + (sale?.clockOffset ?? 0)
