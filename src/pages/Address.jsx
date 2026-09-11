import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LocalizedLink as Link } from '../hooks/useLocalizedNavigation'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const emptyAddress = { street: '', city: '', state: '', zipcode: '', country: '', phone: '' }

const Address = () => {
  const { t } = useTranslation('account')
  const { token, backendUrl, navigate } = useContext(ShopContext)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasSavedAddress, setHasSavedAddress] = useState(false)
  const [formData, setFormData] = useState(emptyAddress)

  const fetchAddress = async () => {
    try {
      const response = await axios.post(
        backendUrl + '/api/user/address',
        {},
        { headers: { token } }
      )
      if (response.data.success) {
        if (response.data.address) {
          setHasSavedAddress(true)
          setFormData({
            street: response.data.address.street || '',
            city: response.data.address.city || '',
            state: response.data.address.state || '',
            zipcode: response.data.address.zipcode || '',
            country: response.data.address.country || '',
            phone: response.data.address.phone || ''
          })
        }
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchAddress()
  }, [token])

  const onChangeHandler = (event) => {
    const { name, value } = event.target
    setFormData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      const response = await axios.post(
        backendUrl + '/api/user/address/update',
        { address: formData },
        { headers: { token } }
      )
      if (response.data.success) {
        setHasSavedAddress(true)
        toast.success(t('profile.addressPage.saveSuccess'))
      } else {
        toast.error(response.data.message || t('profile.addressPage.saveFailed'))
      }
    } catch (error) {
      console.log(error)
      toast.error(t('profile.addressPage.saveFailed'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[60vh]'>
        <div className='text-gray-500'>{t('profile.loading')}</div>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center py-10'>
      <div className='w-full max-w-md'>
        <Link to='/profile' className='text-sm text-stone hover:text-ink'>
          &larr; {t('profile.addressPage.back')}
        </Link>
      </div>

      <div className='bg-white shadow-md rounded-lg p-8 w-full max-w-md mt-4'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-2'>{t('profile.addressPage.heading')}</h2>
        {!hasSavedAddress && (
          <p className='text-gray-500 text-sm mb-6'>{t('profile.addressPage.empty')}</p>
        )}

        <form onSubmit={onSubmitHandler} className='flex flex-col gap-4 mt-4'>
          <input required onChange={onChangeHandler} name='street' value={formData.street} autoComplete='street-address' className='border border-line rounded py-1.5 px-3.5 w-full' type='text' placeholder={t('placeholders.street', { ns: 'checkout' })} />

          <div className='flex gap-3'>
            <input required onChange={onChangeHandler} name='city' value={formData.city} autoComplete='address-level2' className='border border-line rounded py-1.5 px-3.5 w-full' type='text' placeholder={t('placeholders.city', { ns: 'checkout' })} />
            <input onChange={onChangeHandler} name='state' value={formData.state} autoComplete='address-level1' className='border border-line rounded py-1.5 px-3.5 w-full' type='text' placeholder={t('placeholders.state', { ns: 'checkout' })} />
          </div>

          <div className='flex gap-3'>
            <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} autoComplete='postal-code' inputMode='numeric' className='border border-line rounded py-1.5 px-3.5 w-full' type='text' placeholder={t('placeholders.zipcode', { ns: 'checkout' })} />
            <input required onChange={onChangeHandler} name='country' value={formData.country} autoComplete='country-name' className='border border-line rounded py-1.5 px-3.5 w-full' type='text' placeholder={t('placeholders.country', { ns: 'checkout' })} />
          </div>

          <input onChange={onChangeHandler} name='phone' value={formData.phone} autoComplete='tel' className='border border-line rounded py-1.5 px-3.5 w-full' type='tel' placeholder={t('placeholders.phone', { ns: 'checkout' })} />

          <button
            type='submit'
            disabled={saving}
            className='w-full bg-ink text-paper py-2.5 rounded disabled:opacity-60'
          >
            {t('profile.addressPage.saveButton')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Address
