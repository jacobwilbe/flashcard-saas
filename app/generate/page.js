'use client'

import { useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  CardActionArea,
  AppBar,
  Toolbar,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import {db} from '@/firebase'
import {doc, collection, setDoc, getDoc, writeBatch} from 'firebase/firestore'
import { SignedIn, UserButton, useUser } from '@clerk/nextjs'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/app/theme';
import Link from 'next/link';



export default function Generate() {
  const {isSignedIn, user} = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState(false)
  const [text, setText] = useState('')
  const [setName, setSetName] = useState('')
  const [open, setOpen] = useState(false)
  const router = useRouter();
  const [textType, setTextType] = useState(true)
  const [pdfType, setPdfType] = useState(false)
  const [pdfFile, setPdfFile] = useState(null)


  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };






  const handleSubmit = async (e) => {
    if (textType) {
      fetch('/api/generate', {
        method: 'POST',
        body: text,
      }).then((res) => res.json())
      .then((data) => {
        console.log(data)
        setFlashcards(data)
      })
    } else if (pdfType && pdfFile) {
      e.preventDefault();
      if (!pdfFile) {
        alert('Please select a file');
        return;
      }
  
      const formData = new FormData();
      formData.append('pdfFile', pdfFile);
  
      try {
        const response = await fetch('/api/generatePdf', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        setFlashcards(data)
      } catch (error) {
        console.error('Error: this is the error', error);
      }
    }
  }

  const handleCardClick = (id) => {
    setFlipped(prev => ({
        ...prev,
        [id]: !prev[id]
    }))
  }
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const saveFlashcards =  async () => { 
    if (!isSignedIn || !user) {
        router.push('/sign-in')
        return
    }
    if (!setName) {
        alert('Please enter a name for your flashcard set.')
    }
    try {
      const userDocRef = doc(collection(db, 'users'), user.id)
      const userDocSnap = await getDoc(userDocRef)
      const batch = writeBatch(db)

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data()
        const updatedSets = [...(userData.flashcardSets || []), { name: setName }]
        batch.update(userDocRef, { flashcardSets: updatedSets })
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName}] })
      }
  
      const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName)
      batch.set(setDocRef, { flashcards })
  
      await batch.commit()
  
      alert('Flashcards saved successfully!')
      handleClose()
      setSetName('')
      router.push('/flashcards')
    } catch (error) {
      console.error('Error saving flashcards:', error)
      alert('An error occurred while saving flashcards. Please try again.')
    }
  }

  const textOn = () => {
    setTextType(true)
    setPdfType(false)
  }
      
  const pdfOn = () => {
    setTextType(false)
    setPdfType(true)
  }

  if (!isSignedIn) {
    router.push('/sign-in')
  }



      



  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Box maxWidth="100%" minWidth="100%">
        <AppBar position="fixed" elevation={8} sx={{
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
            <Button color="inherit" component={Link} href="/" passHref>Home</Button>
            <Button color="inherit" component={Link} href="/flashcards" passHref>Flashcards</Button>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md">
          <Box 
            sx={{ 
                my: 4,
                mb: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Generate Flashcards
            </Typography>
            <Paper sx={{p: 4, width: '100%'}}>
                <Box sx={{display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 2}}>
                  <Button variant="contained" color="primary" onClick={textOn}>Text</Button>
                  <Button variant="contained" color="primary" onClick={pdfOn}>PDF</Button>
                </Box>
                {textType && (
                  <>
                    <TextField
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      label="Enter text"
                      fullWidth
                      multiline
                      rows={4}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      fullWidth
                    >
                      Generate Flashcards
                    </Button>
                  </>
                )}
                {pdfType && (
                  <Box sx={{ mb: 2 }}>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                    {pdfFile && <p>Selected file: {pdfFile.name}</p>}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      fullWidth
                      disabled={!pdfFile}
                      sx={{ mt: 2 }}
                    >
                      Generate Flashcards
                    </Button>
                  </Box>
                )}
            </Paper>
          </Box>
          
          {flashcards.length > 0 && (
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Flashcards preview
                </Typography>
                <Grid container spacing={3}>
                    {flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardActionArea
                                    onClick={() => {
                                        handleCardClick(index)
                                    }}
                                >
                                    <CardContent>
                                        <Box
                                            sx={{
                                                perspective: '1000px',
                                                '& > div': {
                                                    transition: 'transform 0.6s',
                                                    transformStyle: 'preserve-3d',
                                                    position: 'relative',
                                                    width: '100%',
                                                    height: '200px',
                                                    boxShadow: '0 4px 8px 0 rgba(0,0,0, 0.2)',
                                                    transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                },
                                                '& > div > div': {
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backfaceVisibility: 'hidden',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: 4,
                                                    boxSizing: 'border-box',
                                                },
                                                '& > div > div:nth-of-type(2)': {
                                                    transform: 'rotateY(180deg)',
                                                },
                                            }}
                                        >
                                            <div>
                                                <div>
                                                    <Typography variant="h5" component="div">
                                                        {flashcard.front}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography variant="h5" component="div">
                                                        {flashcard.back}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))} 
                </Grid>
                <Box sx={{mt: 4, display: 'flex', justifyContent: 'center'}}>
                    <Button variant="contained" color="secondary" onClick={handleOpen}>
                        Save Flashcards
                    </Button>
                </Box>
            </Box>
          )}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Save Flashcards</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter a name for your flashcard collection.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="Set Name"
                type="text"
                fullWidth
                value={setName}
                onChange={(e) => setSetName(e.target.value)}
                variant="outlined"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={saveFlashcards} color="primary">
                    Save
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
        
    </ThemeProvider>
  )
}