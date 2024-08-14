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
} from '@mui/material'
import { useRouter } from 'next/navigation'
import {db} from '@/firebase'
import {doc, collection, setDoc, getDoc, writeBatch} from 'firebase/firestore'
import { useUser } from '@clerk/nextjs'

export default function Generate() {
  const {user} = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState(false)
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)
  const router = useRouter();



  const handleSubmit = async () => {
    
    fetch('api/generate', {
      method: 'POST',
      body: text,
    }).then((res) => res.json())
    .then((data) => {
      setFlashcards(data)
    })

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
    if (!name) {
        alert('Please enter a name for your flashcard set.')
    }
    const batch = writeBatch(db)
    const userDocref = doc(collection(db, 'users'), user.id)
    const docSnap = await getDoc(userDocref)

    if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || []
        if (collections.find((f) => f.name === name)) {
            alert('You already have a flashcard set with this name.')
            return
        } else {
            collections.push({name})
            batch.set(userDocref, {flashcards: collections}, {merge: true})
        }
    }else {
        batch.set(userDocref, {flashcards: [{name}]})
    }
    const colref = collection(userDocref, name)
    flashcards.forEach((flashcard) => {
        const cardDocRef = doc(colref)
        batch.set(cardDocRef, flashcard)
    })
    await batch.commit()
    handleClose()
    router.push('/flashcards')
  }



  

  return (
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
            label="collection Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
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

  )
}