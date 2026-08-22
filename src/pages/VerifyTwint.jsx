import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import axios from 'axios'

const VerifyTwint = () => {
    const { t } = useTranslation('account')
    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext)
    const [searchParams] = useSearchParams()
    
    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')

    const verifyPayment = async () => {
        try {
            if (!token) {
                navigate('/login')
                return
            }

            const response = await axios.post(backendUrl + '/api/order/verifyTwint', {
                success,
                orderId
            }, { headers: { token } })

            if (response.data.success) {
                setCartItems({})
                navigate('/orders')
                toast.success(t('verify.paymentCompleted'))
            } else {
                navigate('/orders')
                toast.error(response.data.message || t('verify.paymentVerificationFailed'))
            }
        } catch (error) {
            console.log(error)
            navigate('/orders')
            toast.error(t('verify.paymentVerificationFailed'))
        }
    }

    useEffect(() => {
        if (token && orderId) {
            verifyPayment()
        } else if (!token) {
            navigate('/login')
        } else {
            navigate('/cart')
        }
    }, [token, orderId, success])

    return (
        <div className='min-h-[60vh] flex items-center justify-center'>
            <div className='text-center'>
                <div className='w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4'></div>
                <p className='text-lg'>{t('verify.twintVerifying')}</p>
                <p className='text-sm text-gray-600 mt-2'>{t('verify.pleaseWait')}</p>
            </div>
        </div>
    )
}

export default VerifyTwint
