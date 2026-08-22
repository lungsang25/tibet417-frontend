// Single source of truth for everything Google reads about this site.
//
// Before this file existed the canonical URL was copy-pasted as a string literal
// in ten places and had already drifted. Import from here instead of retyping.
//
// ─────────────────────────────────────────────────────────────────────────────
// Filled in from the operator's real Impressum (the site previously shipped
// Faker.js placeholder values here — "54709 Willms Station, Washington, USA",
// "(415) 555-0132" — which Google ingested and repeated back in its AI
// Overview; still empty fields below mean "omit", not "make something up").
// This is the single source: Contact page, Impressum, and the Organization
// structured data all read from here.
// ─────────────────────────────────────────────────────────────────────────────

export const siteUrl = 'https://www.tibet417.com'
export const siteName = 'Tibet417'
export const legalName = 'Tibet417 Fashion'

export const defaultTitle = 'Tibet417 | Authentic Tibetan & Himalayan Fashion'
export const defaultDescription =
  'Tibet417 brings authentic Tibetan and Himalayan fashion to Switzerland. Handpicked clothing and accessories, shipped from Switzerland in CHF.'

// The store charges CHF: see tibet417-backend/controllers/orderController.js
// (Payrexx, currency: 'CHF') and the GTC, "Prices are strictly net and in Swiss
// francs (CHF)". Product pages used to render a '$' against those same amounts.
export const currency = 'CHF'
export const currencyCode = 'CHF'

// Legacy static defaults — SEO.jsx and schema.js now derive the active
// locale/language per-request from i18next instead of importing these, but
// they remain as the English fallback for anything rendered outside a
// language-aware context.
export const locale = 'en_CH'
export const language = 'en'

export const SUPPORTED_LANGS = ['en', 'de', 'fr', 'it']
export const DEFAULT_LANG = 'en'

// Switzerland's national languages (de/fr/it) plus English, all localized to
// the Swiss market rather than to Germany/France/Italy.
export const LOCALE_MAP = { en: 'en_CH', de: 'de_CH', fr: 'fr_CH', it: 'it_CH' }
export const localeFor = (lang) => LOCALE_MAP[lang] || LOCALE_MAP[DEFAULT_LANG]

/** hreflang alternates (incl. x-default) for an unprefixed path like '/about'. */
export const hreflangAlternates = (unprefixedPath = '/') => [
  ...SUPPORTED_LANGS.map((lang) => ({
    lang,
    url: absoluteUrl(`/${lang}${unprefixedPath === '/' ? '' : unprefixedPath}`),
  })),
  { lang: 'x-default', url: absoluteUrl(`/${DEFAULT_LANG}${unprefixedPath === '/' ? '' : unprefixedPath}`) },
]

export const business = {
  email: 'tibet417@gmail.com',
  telephone: '+41 78 204 20 16',
  streetAddress: 'Bahnhofplatz 5',
  postalCode: '9000',
  addressLocality: 'St. Gallen',
  addressCountry: 'CH',
  // Swiss UID (Unternehmens-Identifikationsnummer). The same number suffixed
  // "MWST" is also the VAT registration number — see Impressum.
  uid: 'CHE-340.031.244',
  // Managing director named in the Impressum's "Vertretungsberechtigte
  // Personen" section. A person's name, so it is not translated — only the
  // role label (impressum.json's representatives.role) is.
  representativeName: 'Gyanaktsang',
}

// Only list profiles that actually resolve. The previous Organization schema
// pointed sameAs at facebook/instagram/twitter handles that do not exist, which
// undermines the entity resolution it was meant to support.
export const socialProfiles = []

/** PostalAddress for JSON-LD, or null when the address is not filled in yet. */
export const postalAddressSchema = () => {
  const { streetAddress, postalCode, addressLocality, addressCountry } = business
  if (!streetAddress || !postalCode || !addressLocality) return null
  return {
    '@type': 'PostalAddress',
    streetAddress,
    postalCode,
    addressLocality,
    addressCountry,
  }
}

/** Absolute URL for a site-relative path. */
export const absoluteUrl = (path = '/') =>
  `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`

export const ogImage = absoluteUrl('/og-image.jpg')
export const logoUrl = absoluteUrl('/logo.png')
