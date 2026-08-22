import { SUPPORTED_LANGS } from '../config/site'

const STORAGE_KEY = 'tibet417_lang'

/** A visitor's remembered language choice, or null if none saved / invalid. */
export const getSavedLang = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return SUPPORTED_LANGS.includes(saved) ? saved : null
  } catch {
    return null
  }
}

export const saveLang = (lang) => {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // Private browsing / storage disabled — the switch still works for this visit.
  }
}
