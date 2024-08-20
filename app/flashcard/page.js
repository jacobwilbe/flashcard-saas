'use client'

import { SignedIn, UserButton, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import {collection, doc, getDoc, getDocs} from 'firebase/firestore'
import {db} from '@/firebase'

import {useSearchParams} from 'next/navigation'
import {Grid, Card, CardActionArea, CardContent, Box, Typography, AppBar, Button, CardHeader, Toolbar, TextField, FormControlLabel, Switch } from "@mui/material"

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/app/theme';
import Link from 'next/link';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles'; 
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const GreenSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#4caf50',
      '&:hover': {
        backgroundColor: alpha('#4caf50', theme.palette.action.hoverOpacity),
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#4caf50',
    },
  }));


export default function Flashcard() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState(false)
    const [testMode, setTestMode] = useState(false)
    const [answers, setAnswers] = useState({})
    const [result, setResult] = useState(false)
    const [correctAnswers, setCorrectAnswers] = useState({})
    const [percentage, setPercentage] = useState(0)
    const [finalScore, setFinalScore] = useState(0)

    const handleCorrect = async (answer, back, index) => {

        const text = "Answer: " + answer + " " + "Back: " + back
        console.log(text)
        
        try {
            const response = await fetch('/api/testMode', {
                method: 'POST',
                body: text,
            })
            const result = await response.json()
            console.log(result)
            setCorrectAnswers(prev => {
                const newCorrectAnswers = { ...prev, [index]: result.result === "True" };
                
                // Calculate percentage using the updated correctAnswers
                const correctCount = Object.values(newCorrectAnswers).filter(bool => bool === true).length;
                const totalAnswers = Object.keys(newCorrectAnswers).length;
                const newPercentage = totalAnswers > 0 ? (correctCount / totalAnswers) * 100 : 0;
                
                console.log(`Correct: ${correctCount}, Total: ${totalAnswers}, Percentage: ${newPercentage}`);

                if (totalAnswers === 10) {
                    setFinalScore(newPercentage)
                }
                
                // Update percentage state
                setPercentage(Math.round(newPercentage));
                
                return newCorrectAnswers;
            });
        }catch(error) { 
            console.log(error)
        }
        setResult(false)
    }

    





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
        if (testMode) return
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
                        <Typography  variant="h6">FlashStudy</Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Button color="inherit" component={Link} href="/generate" passHref>Generate</Button>
                        <Button color="inherit" component={Link} href="/flashcards" passHref>Flashcards</Button>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </Toolbar>
                </AppBar>
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Typography variant="h4" component="h1" sx={{ textAlign: 'center', mt: 2, mb: 2 }}>{id} Flashcards</Typography>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2, mb: 2, mr: 8, ml: 8}}>
                        <FormControlLabel control={<GreenSwitch onChange={() => setTestMode(prev => !prev)}/>} label={testMode ? "Test Mode" : "Study Mode"} />
                        <Box sx={{width: '75px', height: '75px', marginLeft: '10px'}}>
                            {testMode && 
                                <CircularProgressbar 
                                    value={percentage} 
                                    text={`${percentage}%`}
                                    styles={buildStyles({
                                        // Rotation of path and trail, in number of turns (0-1)
                                        rotation: 0.25,
                                    
                                        // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                        strokeLinecap: 'butt',
                                    
                                        // Text size
                                        textSize: '16px',
                                    
                                        // How long animation takes to go from one percentage to another, in seconds
                                        pathTransitionDuration: 0.5,
                                    
                                        // Can specify path transition in more detail, or remove it entirely
                                        // pathTransition: 'none',
                                    
                                        // Colors
                                        pathColor: 'green',
                                        textColor: 'white',
                                        trailColor: 'white',
                                        backgroundColor: '#3e98c7',
                                      })}

                                />
                            }
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, mb: 4, mr: 8, ml: 8}}>
                    <Grid container spacing={3}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <Card sx={{
                                    backgroundColor: 'white',
                                    color: 'black',
                                    border: '8px solid',
                                    borderColor: testMode ? correctAnswers[index] === true ? 'green' : correctAnswers[index] === false ? 'red' : 'white' : 'white',
                                }}>
                                    <CardHeader 
                                        title={index + 1 + "."} 
                                        sx={{
                                            backgroundColor: 'white',
                                            color: 'black',
                                        }}
                                    >
                                    </CardHeader>
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
                                    {testMode && (
                                        <Box flexDirection="row" justifyContent="center" alignItems="center" >
                                            <TextField 
                                            id={index} 
                                            label="..."
                                            multiline 
                                            fullWidth
                                            value={answers[index] || ''} 
                                            onChange={(e) => setAnswers(prev => ({...prev, [index]: e.target.value}))} 
                                            sx={{
                                                '& .MuiInputBase-input': {
                                                    color: 'black',
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        color: 'black',
                                                    },
                                            }}
                                        />
                                            <Button onClick={() => handleCorrect(answers[index], flashcard.back, index)}>Submit</Button>
                                        </Box>
                                    )}
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                {(finalScore > 0) && <Button variant="h4" component="h1" sx={{ textAlign: 'center', mt: 4, mb: 4 }}>View Results</Button>}
            </Box>
        </ThemeProvider>
    )


    



    



}