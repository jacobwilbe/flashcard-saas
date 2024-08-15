

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Box, Button, Toolbar, Typography, Grid, Container } from "@mui/material";
import Head from "next/head";
import Link from "next/link";



export default function Home(){



  return (
    <Container maxWidth="100vw">
      <Head>
        <title>FlashCard SaaS</title>
        <meta name="description" content="The easiest way to create flashcards from your text." />
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography variant ="h6" style={{flexGrow: 1}}>FlashStudy</Typography>
          <SignedOut>
            <Button color="inherit" component={Link} href="/sign-in">
              {' '}
              Login
            </Button>
            <Button color="inherit" component={Link} href="/sign-up">
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box sx={{textAlign: 'center', my: 4}}>
        <Typography variant= "h2" component="h1" gutterBottom>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant ="h5" component="h2" gutterBottom>
          The easiest way to create flashcards from your text.
        </Typography>
        <Button variant="contained" color="primary" sx={{mt: 2, mr: 2}} component ={Link} href="/generate/">
          Get Started
        </Button>
        <Button variant="outlined" color="primary" sx={{mt: 2}}>
          Learn More
        </Button>
      </Box>
      <Box sx={{my: 6}}>
        <Typography variant="h4" component="h2" gutterBottom>Features</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md ={4}>
            <Typography variant="h6" component="h3" gutterBottom>Easy Text to Flashcards</Typography>
            <Typography>
              {' '}
              Simply copy and paste your text into the app and we will generate flashcards for you.
            </Typography>
          </Grid>
          <Grid item xs={12} md ={4}>
            <Typography variant="h6" component="h3" gutterBottom>Smart Flashcards</Typography>
            <Typography>
              {' '}
              Our AI intelligently organizes your text into concise flashcards tailored to your learning style.
            </Typography>
          </Grid>
          <Grid item xs={12} md ={4}>
            <Typography variant="h6" component="h3" gutterBottom>Accessible Anywhere</Typography>
            <Typography>
              {' '}
              Access your flashcards from anywhere, on any device, at any time. Study on the go and never miss a beat.
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{my: 6, textAlign: 'center'}}>
        <Typography variant="h4" component="h2" gutterBottom>Pricing</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md ={6}>
            <Box 
              sx ={{
                p: 3, 
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
              }}
            >
              <Typography variant="h5" component="h3" gutterBottom>Basic</Typography>
              <Typography variant="h6" component="h3" gutterBottom>$5 / month</Typography>
              <Typography>
                {' '}
                Access to basic card features and limited storage.
              </Typography>
              <Button variant="contained" color="primary" sx={{mt: 2}}>
                Choose Basic
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md ={6}>
            <Box 
              sx ={{
                p: 3, 
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
              }}
            >
              <Typography variant="h5" component="h3" gutterBottom>Pro</Typography>
              <Typography variant="h6" component="h3" gutterBottom>$10 / month</Typography>
              <Typography>
                {' '}
                Access to unlimited flashcards and storage with priority support.
              </Typography>
              <Button variant="contained" color="primary" sx={{mt: 2}}>
                Choose Pro
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
  