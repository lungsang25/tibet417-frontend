import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGS } from '../config/site'
import { saveLang } from '../utils/languagePreference'

/**
 * Swaps only the locale segment of the current path, preserving the rest —
 * including the query string, which Collection.jsx's ?search= depends on.
 * Uses plain useNavigate rather than the localized wrapper: this is the one
 * place that is deliberately rewriting the language segment itself.
 *
 * Reads the active language from i18next (`i18n.language`), not
 * `useParams()` — Navbar (and this component with it) renders outside
 * <Routes> in App.jsx, so there is no :lang route param in scope here. Same
 * reasoning as `useLocalizedNavigation.jsx`.
 */
const LanguageSwitcher = ({ className = '' }) => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const switchTo = (nextLang) => {
    setOpen(false)
    if (nextLang === lang) return
    saveLang(nextLang)
    const rest = location.pathname.replace(new RegExp(`^/${lang}`), '')
    navigate(`/${nextLang}${rest}${location.search}${location.hash}`)
  }

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type='button'
        onClick={() => setOpen((v) => !v)}
        aria-label='Change language'
        aria-expanded={open}
        className='text-xs tracking-wide uppercase text-gray-700 cursor-pointer'
      >
        {lang}
      </button>
      {open && (
        <div className='absolute right-0 pt-4 z-10'>
          <div className='flex flex-col gap-2 w-32 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-lg'>
            {SUPPORTED_LANGS.map((l) => (
              <button
                key={l}
                type='button'
                onClick={() => switchTo(l)}
                className={`text-left cursor-pointer hover:text-black ${l === lang ? 'text-black font-medium' : ''}`}
              >
                {t(`common:language.${l}`)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher
