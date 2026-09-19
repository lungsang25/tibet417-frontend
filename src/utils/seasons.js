// Seasons are a product attribute (product.seasons: string[]), not a category, so
// a season page can still be narrowed by Men/Women/Kids. A product tagged with
// all four is a year-round piece. Kept free of JSX and path aliases so
// scripts/prerender.mjs can import it — the homepage tiles, the
// /collection/<season> pages and the sitemap must all agree.
//
// Values are lowercase because they are also the URL slugs and i18n keys, and
// are mirrored by hand in tibet417-backend/constants/seasonConstants.js and
// tibet417-admin/src/utils/seasons.js.
export const SEASON_SLUGS = ['spring', 'summer', 'autumn', 'winter']

export const isSeasonSlug = (slug) => SEASON_SLUGS.includes(slug)

export const hasSeason = (product, slug) =>
  Array.isArray(product.seasons) && product.seasons.includes(slug)

// Meteorological seasons for the Northern Hemisphere (the shop sells into
// Switzerland). Only used to flag which tile is "in season now".
export const getCurrentSeason = (date = new Date()) => {
  const month = date.getMonth()
  if (month >= 2 && month <= 4) return 'spring'
  if (month >= 5 && month <= 7) return 'summer'
  if (month >= 8 && month <= 10) return 'autumn'
  return 'winter'
}
