'use client'
import {SignedIn, UserButton, useUser} from '@clerk/nextjs'
import {useRouter} from 'next/navigation'
import { doc, getDoc, setDoc, collection} from 'firebase/firestore'
import {db} from '@/firebase'
import {useState, useEffect} from 'react'
import { AppBar, Box, Button, Card, CardActionArea, CardContent, CssBaseline, Grid, ThemeProvider, Toolbar, Typography} from '@mui/material'
import theme from '@/app/theme';
import Link from 'next/link'

export default function Flashcards() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    useEffect(() => {
        async function getFlashcards() {
          if (!user) return
          const docRef = doc(collection(db, 'users'), user.id)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            const collections = docSnap.data().flashcardSets || []
            console.log(collections)
            setFlashcards(collections)
          } else {
            await setDoc(docRef, { flashcardSets: [] })
          }
        }
        getFlashcards()
    }, [user])
    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    const handleCardClick = (name) => {
        router.push(`/flashcard?id=${name}`)
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box maxWidth = "100vw">
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
                        <Button color="inherit" component={Link} sx={{mr: 2}} href="/generate" passHref>Generate</Button>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </Toolbar>
                </AppBar>
                <Box
                    sx={{
                        display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, mb: 4, mr: 8, ml: 8
                    }} 
                >
                    <Grid container spacing ={3} sx ={{mt: 4}}>
                        {flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={4} md={4} key ={index}>
                                <Card>
                                    <CardActionArea
                                        onClick = {() => handleCardClick(flashcard.name)}
                                    >
                                        <CardContent>
                                            <Typography variant = "h6" >{flashcard.name}</Typography>
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
