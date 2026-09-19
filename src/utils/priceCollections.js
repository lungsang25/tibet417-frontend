// The "All you can get under 30 franc" collection. Kept free of JSX and path
// aliases so scripts/prerender.mjs can import it too — the homepage rail, the
// /collection/under-30 page and the sitemap must all agree on what qualifies.
export const UNDER_PRICE_LIMIT = 30
export const UNDER_PRICE_SLUG = 'under-30'

// Price 0 is treated as unpriced/placeholder data, not a bargain.
export const isUnderPriceLimit = (product) =>
  product.price > 0 && product.price < UNDER_PRICE_LIMIT
