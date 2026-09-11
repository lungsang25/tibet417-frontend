import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LocalizedLink as Link } from '../hooks/useLocalizedNavigation'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PersonalDetails = () => {
  const { t } = useTranslation('account')
  const { token, backendUrl, navigate } = useContext(ShopContext)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '' })

  const fetchProfile = async () => {
    try {
      const response = await axios.post(
        backendUrl + '/api/user/profile',
        {},
        { headers: { token } }
      )
      if (response.data.success) {
        setFormData({
          name: response.data.user.name || '',
          phone: response.data.user.phone || ''
        })
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
    fetchProfile()
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
        backendUrl + '/api/user/personal-details/update',
        { name: formData.name, phone: formData.phone },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success(t('profile.personalDetailsPage.saveSuccess'))
      } else {
        toast.error(response.data.message || t('profile.personalDetailsPage.saveFailed'))
      }
    } catch (error) {
      console.log(error)
      toast.error(t('profile.personalDetailsPage.saveFailed'))
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
          &larr; {t('profile.personalDetailsPage.back')}
        </Link>
      </div>

      <div className='bg-white shadow-md rounded-lg p-8 w-full max-w-md mt-4'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-6'>{t('profile.personalDetailsPage.heading')}</h2>

        <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
          <input
            required
            onChange={onChangeHandler}
            name='name'
            value={formData.name}
            autoComplete='name'
            className='border border-line rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder={t('profile.personalDetailsPage.namePlaceholder')}
          />
          <input
            onChange={onChangeHandler}
            name='phone'
            value={formData.phone}
            autoComplete='tel'
            className='border border-line rounded py-1.5 px-3.5 w-full'
            type='tel'
            placeholder={t('placeholders.phone', { ns: 'checkout' })}
          />

          <button
            type='submit'
            disabled={saving}
            className='w-full bg-ink text-paper py-2.5 rounded disabled:opacity-60'
          >
            {t('profile.personalDetailsPage.saveButton')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PersonalDetails
