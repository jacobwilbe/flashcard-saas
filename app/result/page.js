'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import getStripe from '@/utils/get-stripe'
import { useSearchParams } from 'next/navigation'

const ResultPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [session, setSession] = useState(null)

    useEffect(() => {
        const fetchCheckoutSession = async () => {
            if (!session_id) return
            try {
                const res = await fetch(`/api/checkout_sessions?session_id=${session_id}`)
                const sessionData = await res.json()
                if (res.ok) {
                    setSession(sessionData)
                } else {
                    setError(sessionData.error)
                }
            } catch (err) {
                setError("An error occurred")
            } finally {
                setLoading(false)
            }
        }
        fetchCheckoutSession()
    }, [session_id])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                <p className="text-xl mt-4">Loading...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <p className="text-xl text-red-500">{error}</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {session.payment_status === 'paid' ? (
                <>
                    <h1 className="text-2xl font-bold">Thank you for your purchase!</h1>
                    <div className="mt-8">
                        <p className="text-lg">Session ID: {session.id}</p>
                        <p className="text-md mt-2">
                            We have received your payment. You will receive an email with the order details shortly.
                        </p>
                    </div>
                </>
            ) : (
                <h1 className="text-2xl font-bold text-red-500">Payment Failed</h1>
            )}
        </div>
    )
}

export default ResultPage