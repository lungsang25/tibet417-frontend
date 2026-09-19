import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ShopContext } from '../context/ShopContext'
import { serverNow } from '../utils/sale'

const pad = (n) => String(n).padStart(2, '0')

const formatRemaining = (ms) => {
  const total = Math.max(0, Math.floor(ms / 1000))
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`
}

/**
 * "Next drop: 50% off in 05:12:33" — or, in the last stage, a line saying the
 * price won't fall any further. Counts down on the server's clock (see
 * serverNow), so a device with the wrong time can't show a wrong countdown.
 * Text only: nothing animates, and it is not a live region, so a screen reader
 * isn't interrupted every second.
 */
const SaleCountdown = () => {
  const { t } = useTranslation('home')
  const { sale } = useContext(ShopContext)
  const [now, setNow] = useState(() => serverNow(sale))

  useEffect(() => {
    if (!sale?.nextChangeAt) return undefined
    const tick = () => setNow(serverNow(sale))
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [sale])

  if (!sale?.active) return null

  if (sale.nextChangeAt === null) {
    return <>{t('sections.sale.finalStage', { percent: sale.percentOff })}</>
  }

  return (
    <>
      {t('sections.sale.nextDrop', { percent: sale.nextPercentOff })}{' '}
      <span className='tabular-nums text-ink'>{formatRemaining(sale.nextChangeAt - now)}</span>
    </>
  )
}

export default SaleCountdown
