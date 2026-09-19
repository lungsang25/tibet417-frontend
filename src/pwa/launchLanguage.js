import { SUPPORTED_LANGS, DEFAULT_LANG } from '../config/site'
import { getSavedLang } from '../utils/languagePreference'
import { isStandalone } from './env'

/*
 * Side-effect module — main.jsx imports it BEFORE './i18n', which reads the
 * language from the URL at import time.
 *
 * The manifest can only name one start_url (/en). Three of the four languages
 * are not English, so a cold start of the installed app at bare /en switches to
 * the user's language first: their saved choice, else the phone's language.
 * On iOS this matters most — the home-screen app gets its own storage, so the
 * choice made in Safari is not there and the phone language is all there is.
 *
 * Only for standalone launches at exactly /en, so ordinary browsing and
 * deep links are untouched, and an explicit switch to English (saved as 'en')
 * is respected.
 */
const phoneLang = () => {
  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const tag of preferred) {
    const base = tag?.slice(0, 2).toLowerCase()
    if (SUPPORTED_LANGS.includes(base)) return base
  }
  return null
}

if (typeof window !== 'undefined' && isStandalone() && window.location.pathname === `/${DEFAULT_LANG}`) {
  const lang = getSavedLang() || phoneLang()
  if (lang && lang !== DEFAULT_LANG) {
    // replaceState, not a redirect: BrowserRouter and i18n both read
    // window.location when they start, so no reload or flash of the wrong page.
    window.history.replaceState(null, '', `/${lang}${window.location.search}${window.location.hash}`)
  }
}
