'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import {collection, doc, getDoc, getDocs} from 'firebase/firestore'
import {db} from '@/firebase'

import {useSearchParams} from 'next/navigation'
import { Container, Grid, Card, CardActionArea, CardContent, Box, Typography } from "@mui/material"

export default function Flashcard() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState(false)

    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    useEffect(() => {
        async function getFlashcard() {
            if (!id || !user) return

            const docRef = doc(collection(doc(collection(db, 'users'), user.id), 'flashcardSets'), id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const data = docSnap.data()
                console.log("Retrieved data:", data)
                setFlashcards(data.flashcards || [])
            } else {
                console.log("No such document!")
            }
        }
        getFlashcard()
    }, [id, user])

    const handleCardClick = (id) => {
        setFlipped(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    return (
        <Container maxWidth="100vw">
        <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                        <CardActionArea onClick={() => handleCardClick(index)}>
                            <CardContent>
                                <Box sx={{
                                    perspective: '1000px',
                                    height: '200px',
                                    position: 'relative',
                                    transformStyle: 'preserve-3d',
                                    transition: 'transform 0.6s',
                                    transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                }}>
                                    <Box sx={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        backfaceVisibility: 'hidden',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <Typography variant="h5" component="div">
                                            {flashcard.front}
                                        </Typography>
                                    </Box>
                                    <Box sx={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        backfaceVisibility: 'hidden',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        transform: 'rotateY(180deg)',
                                    }}>
                                        <Typography variant="h5" component="div">
                                            {flashcard.back}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
        </Grid>
    </Container>
    )


    



    



}