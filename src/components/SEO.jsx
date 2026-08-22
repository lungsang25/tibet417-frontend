import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
  siteName,
  defaultTitle,
  defaultDescription,
  absoluteUrl,
  localeFor,
  hreflangAlternates,
  SUPPORTED_LANGS,
  ogImage as defaultOgImage,
} from '../config/site';
import { buildGraph } from '../config/schema';

/**
 * Per-page metadata.
 *
 * `path` is site-relative ('/about'); the canonical and og:url are derived from
 * it so no page has to repeat the origin. Pass `noindex` on anything behind
 * auth or mid-checkout — pages that render no <SEO> at all inherit the shell's
 * canonical from index.html and end up declaring themselves the homepage.
 *
 * There is deliberately no `keywords` prop. Google has ignored that meta for
 * over a decade, and the stuffed values this site used to emit ("tibet shopping,
 * tibet417, tibetan shopping online, ...") are the likely reason Google rewrote
 * the homepage title down to a bare "Tibet417".
 */
const SEO = ({
  title = defaultTitle,
  description = defaultDescription,
  path = '/',
  ogType = 'website',
  ogImage = defaultOgImage,
  noindex = false,
  breadcrumb = null,
  extraSchemaNodes = [],
}) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  // Each locale's canonical points at itself, not at the English URL — the
  // standard, non-contradictory hreflang pattern. `path` stays unprefixed
  // ('/about') so no call site needs to know about locales.
  const canonical = absoluteUrl(`/${lang}${path === '/' ? '' : path}`);
  const alternates = hreflangAlternates(path);

  // A noindex page should not be advertising itself to schema consumers either.
  const graph = noindex
    ? null
    : buildGraph({ url: canonical, title, description, breadcrumb, extraNodes: extraSchemaNodes, lang });

  return (
    <>
    {/*
      JSON-LD is rendered as an ordinary element rather than inside <Helmet>.

      Helmet only replaces tags whose content it already knows about; when a
      page's graph changes between renders — the collection pages build an
      ItemList that starts empty and refills once products arrive — it appends a
      second <script> instead of swapping the first. Prerendered /collection/men
      shipped two complete, conflicting @graphs that way.

      React updates this node in place, so there is exactly one. JSON-LD is valid
      anywhere in the document, body included.
    */}
    {graph && (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
    )}
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Tells Google the other language versions of this exact page exist,
          each pointing at its own self-referential canonical (see above) —
          the standard hreflang pattern, including a self-reference and one
          x-default entry. */}
      {alternates.map(({ lang: altLang, url }) => (
        <link key={altLang} rel="alternate" hrefLang={altLang} href={url} />
      ))}

      {noindex ? (
        <meta name="robots" content="noindex, follow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={localeFor(lang)} />
      {SUPPORTED_LANGS.filter((l) => l !== lang).map((l) => (
        <meta key={l} property="og:locale:alternate" content={localeFor(l)} />
      ))}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

    </Helmet>
    </>
  );
};

export default SEO;
