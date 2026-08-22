import React, { useLayoutEffect } from 'react'
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom'
import i18n from '../i18n'
import { SUPPORTED_LANGS, DEFAULT_LANG } from '../config/site'
import { getSavedLang } from '../utils/languagePreference'

/**
 * Redirect target for a URL with no valid language segment: a returning
 * visitor's saved choice, or English. Edge-level redirects (vercel.json)
 * cannot read localStorage, so they always land on English first — this is
 * the client-side layer that then honours a saved preference, matching the
 * "default to English, but remember a manual switch" behaviour.
 */
const preferredLang = () => getSavedLang() || DEFAULT_LANG

/** Bare '/' — not matched by '/:lang', so it needs its own route. */
export const RootRedirect = () => <Navigate to={`/${preferredLang()}`} replace />

/**
 * Catches pre-migration URLs with more than one path segment, e.g.
 * /collection/men or /product/<id>, which don't match '/:lang' at all (its
 * children only match under a lang-prefixed parent).
 */
export const LegacyRedirect = () => {
  const location = useLocation()
  return <Navigate to={`/${preferredLang()}${location.pathname}${location.search}`} replace />
}

/**
 * Validates ':lang' and keeps i18next in sync with it. Also catches
 * pre-migration single-segment URLs like /about or /cart — those match this
 * route with lang="about", which would otherwise silently render the index
 * route (Home) instead of redirecting.
 */
const LocaleLayout = () => {
  const { lang } = useParams()
  const location = useLocation()

  const isValid = SUPPORTED_LANGS.includes(lang)

  // i18n/index.js sets the *initial* language straight from the URL, so this
  // effect only matters for a client-side navigation between locales (the
  // language switcher) where the app is already mounted and every
  // useTranslation() subscription is already live — no mount-order race like
  // the one that initial-load handling avoids (see i18n/index.js).
  //
  // Still a layout effect, not a plain effect: it runs before the browser
  // paints, so switching locale via the language switcher doesn't flash the
  // previous language's content for one frame before correcting itself.
  useLayoutEffect(() => {
    if (isValid && i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
  }, [isValid, lang])

  if (!isValid) {
    return <Navigate to={`/${preferredLang()}${location.pathname}${location.search}`} replace />
  }

  return <Outlet />
}

export default LocaleLayout
