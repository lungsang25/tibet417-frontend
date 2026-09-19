import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { isIosSafari, isPrerenderBrowser, isStandalone } from '../pwa/env'

const DISMISS_KEY = 'tibet417_install_dismissed'
const DISMISS_DAYS = 30
// Long enough that it never greets someone who is still working out where they are.
const SHOW_AFTER_MS = 10000

// Never interrupt cart, checkout, sign-in or a payment return.
const QUIET_ROUTE = /^\/(?:en|de|fr|it)\/(?:cart|login|place-order|verify|verify-twint)(?:\/|$)/

const wasDismissedRecently = () => {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY))
    return at > 0 && Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000
  } catch {
    return false
  }
}

const rememberDismissal = () => {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
  } catch {
    // Storage blocked — the banner just comes back next visit.
  }
}

// iOS's Share glyph, shown inline in the instructions so people can spot the button.
const ShareIcon = () => {
  const { t } = useTranslation('common')
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      className='mx-0.5 inline h-4 w-4 align-text-bottom'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      role='img'
      aria-label={t('install.share')}
    >
      <path d='M12 3v12' />
      <path d='m8 7 4-4 4 4' />
      <path d='M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1' />
    </svg>
  )
}

/**
 * "Install the app" banner, mobile only (hidden from the sm breakpoint up).
 *
 * Android/Chrome: captures `beforeinstallprompt` (which suppresses Chrome's own
 * mini-infobar) and offers an Install button that opens the native dialog.
 * iOS Safari: has no install API, so the banner explains Share → Add to Home
 * Screen instead.
 *
 * Renders nothing until one of those applies, so it is absent from the
 * prerendered HTML and from the installed app itself.
 */
const InstallPrompt = () => {
  const { t } = useTranslation('common')
  const { pathname } = useLocation()
  const [installEvent, setInstallEvent] = useState(null)
  const [showIosSteps, setShowIosSteps] = useState(false)
  const [waited, setWaited] = useState(false)
  const [dismissed, setDismissed] = useState(true) // start hidden; decided in the effect below

  useEffect(() => {
    if (isPrerenderBrowser() || isStandalone() || wasDismissedRecently()) return

    setDismissed(false)
    setShowIosSteps(isIosSafari())

    const onBeforeInstall = (e) => {
      e.preventDefault()
      setInstallEvent(e)
    }
    const onInstalled = () => {
      setInstallEvent(null)
      setDismissed(true)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    const timer = setTimeout(() => setWaited(true), SHOW_AFTER_MS)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
      clearTimeout(timer)
    }
  }, [])

  if (dismissed || !waited || QUIET_ROUTE.test(pathname) || (!installEvent && !showIosSteps)) return null

  const dismiss = () => {
    rememberDismissal()
    setDismissed(true)
  }

  const install = async () => {
    // The event is single-use, so drop it whatever the outcome.
    const event = installEvent
    setInstallEvent(null)
    await event.prompt()
    const { outcome } = await event.userChoice
    if (outcome === 'dismissed') dismiss()
  }

  return (
    <div
      role='region'
      aria-label={t('install.title')}
      className='fixed inset-x-3 bottom-3 z-40 flex items-start gap-3 rounded-lg bg-ink p-4 text-white shadow-modal sm:hidden'
    >
      <img src='/favicon-96x96.png' alt='' width='40' height='40' className='h-10 w-10 shrink-0 rounded-md' />
      <div className='flex-1 text-sm'>
        <p className='font-medium'>{t('install.title')}</p>
        <p className='mt-0.5 text-white/70'>
          {installEvent ? t('install.description') : <Trans t={t} i18nKey='install.iosSteps' components={{ share: <ShareIcon /> }} />}
        </p>
        {installEvent && (
          <button type='button' onClick={install} className='mt-3 bg-white px-4 py-2 text-sm font-medium text-ink'>
            {t('install.action')}
          </button>
        )}
      </div>
      <button type='button' onClick={dismiss} aria-label={t('install.dismiss')} className='-m-1 p-1 text-white/70 hover:text-white'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          className='h-5 w-5'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          aria-hidden='true'
        >
          <path d='M18 6 6 18' />
          <path d='m6 6 12 12' />
        </svg>
      </button>
    </div>
  )
}

export default InstallPrompt
