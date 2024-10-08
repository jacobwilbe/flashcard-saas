'use client'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import getStripe from '@/utils/get-stripe'
import {useSearchParams} from 'next/navigation'
import { Box, CircularProgress, Container, Typography } from '@mui/material'

const ResultPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [session, setSession] = useState(null)

    useEffect(() => {
        const fetchCheckoutSession = async () => {
            if(!session_id) return
            try {
                const res = await fetch(`/api/checkout_sessions?session_id=${session_id}`)
                const sessionData = await res.json()
                if(res.ok) {
                    setSession(sessionData)

                }else {
                    setError(sessionData.error)
                }
            }catch (err) {
                setError("An error occured")
            }finally {
                setLoading(false)
            }
        }
        fetchCheckoutSession()
    }, [session_id])

    if(loading){
        return (
            <Container maxWidth = "100vw" sx={{textAlign: 'center', mt: 4}}>
                <CircularProgress />
                <Typography variant = "h6">Loading ...</Typography>
            </Container>
        )
    }

    if(error){
        return (
            <Container maxWidth = "100vw" sx={{textAlign: 'center', mt: 4}}>
                <Typography variant = "h6">{error}</Typography>
            </Container>
        )
    }

    return (
        <Container
            maxWidth = "100vw"
            sx = {{textAlign: 'center', mt: 4}}
        >
          { session.payment_status === 'paid' ? (
            <>
                <Typography variant = "h6">Thank you for your purchase!</Typography>
                <Box sx={{mt:22}}>
                    <Typography variant = "h6">Session ID: {session.id}</Typography>
                    <Typography variant = "body1">
                        We have received your payment. You will receive email with the order details shortly.
                    </Typography>
                </Box>
               
            </>
          ) : (
            <Typography variant = "h6">Payment Failed</Typography>
          )}
        </Container>
    )

}
export default ResultPage