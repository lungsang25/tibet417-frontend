// JSON-LD builders.
//
// Everything is emitted as one @graph whose nodes cross-reference each other by
// @id, rather than as several disconnected <script> blocks. That is what lets
// Google resolve "the Organization that publishes this WebSite that this WebPage
// is part of" as a single entity instead of three unrelated facts — and the
// WebSite node's name/alternateName is what drives the brand-name-instead-of-
// domain header in search results.

import {
  siteUrl,
  siteName,
  legalName,
  defaultDescription,
  DEFAULT_LANG,
  logoUrl,
  socialProfiles,
  business,
  postalAddressSchema,
  absoluteUrl,
} from './site'

export const ORGANIZATION_ID = `${siteUrl}/#organization`
export const WEBSITE_ID = `${siteUrl}/#website`

export const organizationNode = () => {
  const address = postalAddressSchema()
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: siteName,
    legalName,
    url: `${siteUrl}/`,
    description: defaultDescription,
    logo: {
      '@type': 'ImageObject',
      '@id': `${siteUrl}/#logo`,
      url: logoUrl,
      contentUrl: logoUrl,
      caption: siteName,
    },
    image: { '@id': `${siteUrl}/#logo` },
    ...(socialProfiles.length ? { sameAs: socialProfiles } : {}),
    ...(address ? { address } : {}),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: business.email,
      areaServed: 'CH',
      availableLanguage: ['en', 'de', 'fr', 'it'],
      ...(business.telephone ? { telephone: business.telephone } : {}),
    },
  }
}

export const webSiteNode = (lang = DEFAULT_LANG) => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${siteUrl}/`,
  name: siteName,
  alternateName: legalName,
  description: defaultDescription,
  publisher: { '@id': ORGANIZATION_ID },
  inLanguage: lang,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/${lang}/collection?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
})

export const webPageNode = ({ url, title, description, lang = DEFAULT_LANG }) => ({
  '@type': 'WebPage',
  '@id': `${url}#webpage`,
  url,
  name: title,
  description,
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': ORGANIZATION_ID },
  inLanguage: lang,
})

/**
 * @param {{name: string, path?: string}[]} trail - omit `path` on the last crumb
 */
export const breadcrumbNode = (trail, pageUrl) => ({
  '@type': 'BreadcrumbList',
  '@id': `${pageUrl}#breadcrumb`,
  itemListElement: trail.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    ...(crumb.path ? { item: absoluteUrl(crumb.path) } : {}),
  })),
})

/**
 * Assembles the full @graph for a page: site-wide identity nodes first, then
 * the page-specific ones.
 */
export const buildGraph = ({ url, title, description, breadcrumb, extraNodes = [], lang = DEFAULT_LANG }) => ({
  '@context': 'https://schema.org',
  '@graph': [
    organizationNode(),
    webSiteNode(lang),
    webPageNode({ url, title, description, lang }),
    ...(breadcrumb ? [breadcrumbNode(breadcrumb, url)] : []),
    ...extraNodes,
  ],
})
