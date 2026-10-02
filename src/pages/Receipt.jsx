import React, { useContext, useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'
import { LocalizedLink as Link } from '../hooks/useLocalizedNavigation'
import PageLoader from '../components/PageLoader'
import { formatDate } from '../utils/formatDate'
import { legalName, business } from '../config/site'

const money = (value) => (Math.round(value * 100) / 100).toFixed(2)

/**
 * Printable receipt for one order. "Save as PDF" is the browser's print
 * dialog, which avoids a PDF dependency. The print stylesheet hides everything
 * except #receipt (the navbar and footer have no shared wrapper to target).
 */
const Receipt = () => {
  const { t, i18n } = useTranslation('account')
  const { orderId } = useParams()
  const { pathname } = useLocation()
  const { backendUrl, token, authChecked, currency, navigate } = useContext(ShopContext)

  const [order, setOrder] = useState(null)
  const [state, setState] = useState('loading')   // 'loading' | 'ready' | 'notfound'

  useEffect(() => {
    if (!authChecked) return

    if (!token) {
      const target = '/' + pathname.split('/').slice(2).join('/')
      navigate(`/login?redirect=${encodeURIComponent(target)}`)
      return
    }

    let cancelled = false
    const load = async () => {
      setState('loading')
      try {
        const response = await axios.post(backendUrl + '/api/order/single',
          { orderId }, { headers: { token } })
        if (cancelled) return
        if (response.data.success) {
          setOrder(response.data.order)
          setState('ready')
        } else {
          setState('notfound')
        }
      } catch (error) {
        console.log(error)
        if (!cancelled) setState('notfound')
      }
    }
    load()
    return () => { cancelled = true }
  }, [authChecked, token, orderId, backendUrl, pathname, navigate])

  if (!authChecked || state === 'loading') {
    return <PageLoader label={t('receipt.loading')} />
  }

  if (state === 'notfound' || !order) {
    return (
      <div className='border-t pt-16 py-16 text-center flex flex-col items-center gap-4'>
        <p className='text-stone'>{t('receipt.notFound')}</p>
        <Link to='/orders' className='bg-ink text-paper text-sm px-8 py-3'>
          {t('orders.detail.notFoundCta')}
        </Link>
      </div>
    )
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = order.redemption?.discountAmount || 0
  // Shipping is not stored on the order, so derive it from what is.
  const shipping = Math.max(0, order.amount - subtotal + discount)
  const address = order.address || {}
  const number = order._id.slice(-8).toUpperCase()

  return (
    <div className='border-t pt-10'>
      <style>{`@media print {
        body * { visibility: hidden; }
        #receipt, #receipt * { visibility: visible; }
        #receipt { position: absolute; left: 0; top: 0; width: 100%; border: 0; padding: 0; }
      }`}</style>

      <div className='flex items-center justify-between gap-4 mb-6 print:hidden'>
        <Link to={`/orders/${order._id}`} className='text-sm text-stone hover:text-ink'>
          &larr; {t('receipt.back')}
        </Link>
        <button
          type='button'
          onClick={() => window.print()}
          className='bg-ink text-paper text-sm px-6 py-3 cursor-pointer'
        >
          {t('receipt.print')}
        </button>
      </div>

      <div id='receipt' className='max-w-3xl mx-auto border border-line p-6 sm:p-10 text-sm text-stone'>
        <div className='flex flex-wrap justify-between gap-6 border-b pb-6'>
          <div>
            <h1 className='text-2xl text-ink'>{t('receipt.title')}</h1>
            <p className='mt-1'>{t('receipt.number')} {number}</p>
            <p>{t('receipt.date')}: {formatDate(order.date, i18n.language)}</p>
            <p>{t('receipt.payment')}: {order.paymentMethod}</p>
          </div>
          <address className='not-italic sm:text-right leading-relaxed'>
            <span className='text-ink font-medium'>{legalName}</span><br />
            {business.streetAddress}<br />
            {business.postalCode} {business.addressLocality}<br />
            {business.email}<br />
            {business.uid}
          </address>
        </div>

        <div className='mt-6'>
          <h2 className='uppercase tracking-label mb-2'>{t('receipt.billedTo')}</h2>
          <address className='not-italic leading-relaxed'>
            {address.firstName} {address.lastName}<br />
            {address.street}<br />
            {address.zipcode} {address.city}<br />
            {address.country}
          </address>
        </div>

        <div className='overflow-x-auto mt-8'>
          <table className='w-full text-left'>
            <thead>
              <tr className='border-b uppercase tracking-label'>
                <th className='py-2 pr-2 font-normal'>{t('receipt.item')}</th>
                <th className='py-2 pr-2 font-normal'>{t('receipt.size')}</th>
                <th className='py-2 pr-2 font-normal text-right'>{t('receipt.qty')}</th>
                <th className='py-2 pr-2 font-normal text-right'>{t('receipt.unit')}</th>
                <th className='py-2 font-normal text-right'>{t('receipt.lineTotal')}</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={`${item._id}-${item.size}-${index}`} className='border-b'>
                  <td className='py-2 pr-2 text-ink'>{item.name}</td>
                  <td className='py-2 pr-2'>{item.size}</td>
                  <td className='py-2 pr-2 text-right'>{item.quantity}</td>
                  <td className='py-2 pr-2 text-right'>{money(item.price)}</td>
                  <td className='py-2 text-right'>{money(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <dl className='mt-6 ml-auto max-w-xs flex flex-col gap-1'>
          <div className='flex justify-between'>
            <dt>{t('receipt.subtotal')}</dt><dd>{currency} {money(subtotal)}</dd>
          </div>
          {discount > 0 && (
            <div className='flex justify-between'>
              <dt>{t('receipt.discount')}</dt><dd>&minus;{currency} {money(discount)}</dd>
            </div>
          )}
          <div className='flex justify-between'>
            <dt>{t('receipt.shipping')}</dt><dd>{currency} {money(shipping)}</dd>
          </div>
          <div className='flex justify-between border-t pt-2 mt-1 text-base font-medium text-ink'>
            <dt>{t('receipt.total')}</dt><dd>{currency} {money(order.amount)}</dd>
          </div>
        </dl>

        <p className='mt-10 text-center text-ink'>{t('receipt.thanks')}</p>
      </div>
    </div>
  )
}

export default Receipt
