import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import i18n from '../i18n'
import { DEFAULT_LANG } from '../config/site'

/**
 * Prefixes a site-relative path with the active language.
 *
 * Reads the language straight off the i18next instance rather than from a
 * route param — ShopContextProvider wraps <App/> above <Routes> in main.jsx,
 * so it has no :lang param in scope, and this needs to work there too.
 */
export const localizePath = (path) => {
  if (/^https?:\/\//.test(path) || path.startsWith('#')) return path
  const lang = i18n.language || DEFAULT_LANG
  const rest = path.startsWith('/') ? path : `/${path}`
  return `/${lang}${rest === '/' ? '' : rest}`
}

export const useLocalizedNavigate = () => {
  const navigate = useNavigate()
  return (to, options) => {
    if (typeof to === 'number') return navigate(to)
    navigate(localizePath(to), options)
  }
}

export const LocalizedLink = React.forwardRef(({ to, ...props }, ref) => (
  <Link ref={ref} to={localizePath(to)} {...props} />
))
LocalizedLink.displayName = 'LocalizedLink'

export const LocalizedNavLink = React.forwardRef(({ to, ...props }, ref) => (
  <NavLink ref={ref} to={localizePath(to)} {...props} />
))
LocalizedNavLink.displayName = 'LocalizedNavLink'
