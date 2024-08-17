

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Box, Button, Toolbar, Typography, Grid, Container } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';



export default function Home(){



  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Box maxWidth="100vw">
        <Head>
          <title>FlashStudy</title>
          <meta name="description" content="The easiest way to create flashcards from your text." />
        </Head>
        <AppBar position="static" elevation={8} sx={{
            background: 'transparent'
          }}>
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
        <Box sx={{textAlign: 'center', my: 6, padding: 2, borderRadius: 4, color: 'white' }}>
          <Typography variant= "h2" component="h1" gutterBottom>
            Welcome to FlashStudy
          </Typography>
          <Typography variant ="h5" component="h2" gutterBottom>
            The easiest way to create flashcards from your text and pdfs.
          </Typography>
        </Box>
        <Box sx={{my: 3, padding: 2, textAlign: 'center'}}>
          <Typography variant="h4" component="h2" gutterBottom>Features</Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md ={4}>
              <Box sx={{p: 3, border: '1px solid', borderColor: 'white', borderRadius: 2}}>
                <Typography variant="h6" component="h3" gutterBottom>Easy Text to Flashcards</Typography>
                <Typography>
                  {' '}
                  Simply copy and paste your text into the app and we will generate flashcards for you.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md ={4}>
              <Box sx={{p: 3, border: '1px solid', borderColor: 'white', borderRadius: 2}}>
                <Typography variant="h6" component="h3" gutterBottom>Smart Flashcards</Typography>
                <Typography>
                  {' '}
                  Our AI intelligently organizes your text into concise flashcards tailored to your learning style.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md ={4}>
              <Box sx={{p: 3, border: '1px solid', borderColor: 'white', borderRadius: 2}}>
                <Typography variant="h6" component="h3" gutterBottom>Accessible Anywhere</Typography>
                <Typography>
                  {' '}
                  Access your flashcards from anywhere, on any device, at any time. Study on the go and never miss a beat.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{my: 6,
                textAlign: 'center',
                borderRadius: 4,
                padding: 4}}>
          <Typography variant="h4" component="h2" gutterBottom>Pricing</Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md ={6}>
              <Box 
                sx ={{
                  p: 3, 
                  border: '1px solid',
                  background: 'linear-gradient(45deg, #8A2BE2 30%, #FF69B4 90%)',
                  borderColor: 'black',
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
                  borderColor: 'black',
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #8A2BE2 30%, #FF69B4 90%)'
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
          <Button variant="contained"  sx={{mt: 6,  borderColor: 'white', border: '1px solid', color: 'white', background: 'black'}} component ={Link} href="/generate/">
            Get Started
          </Button>
        </Box>
      </Box>

    </ThemeProvider>
    
  )
}
  