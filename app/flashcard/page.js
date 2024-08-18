'use client'

import { SignedIn, UserButton, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import {collection, doc, getDoc, getDocs} from 'firebase/firestore'
import {db} from '@/firebase'

import {useSearchParams} from 'next/navigation'
import { Container, Grid, Card, CardActionArea, CardContent, Box, Typography, AppBar, Button, CardHeader, Toolbar } from "@mui/material"

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/app/theme';
import Link from 'next/link';

export default function Flashcard() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState(false)

    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    useEffect(() => {
        async function getFlashcard() {
            if (!id || !user) return
            console.log(user.id)

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
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box maxWidth="100vw">
                <AppBar position="static" elevation={8} sx={{
                    background: 'transparent',
                    boxShadow: 'none',
                    borderBottom: '1px solid',
                    borderColor: 'white',
                    borderRadius: 4,
                    padding: 2,
                    marginBottom: 4,
                    width: '100%',
                    position: 'sticky',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 24,
                    fontFamily: 'Arial, sans-serif'
                }}>
                <Toolbar>
                    <Typography variant="h6">FlashStudy</Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button color="inherit" component={Link} href="/generate" passHref>Generate</Button>
                    <Button color="inherit" component={Link} href="/flashcards" passHref>Flashcards</Button>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </Toolbar>
                </AppBar>
                <Typography variant="h4" component="h1" sx={{ textAlign: 'center', mt: 4, mb: 4 }}>{id} Flashcards</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, mb: 4, mr: 8, ml: 8}}>
                    <Grid container spacing={3}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <Card sx={{
                                    backgroundColor: 'white',
                                    color: 'black',
                                }}>
                                    <CardActionArea onClick={() => handleCardClick(index)}>
                                        <CardHeader title={index + 1 + "."} sx={{
                                            backgroundColor: 'white',
                                            color: 'black',
                                        }}></CardHeader>
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
                </Box>
            </Box>
        </ThemeProvider>
    )


    



    



}