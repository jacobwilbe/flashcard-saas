import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

export default function Home(){
  <>
    <AppBar>
      <Toolbar>
        <Typography variant ="h6" style={{flexGrow: 1}}></Typography>
          FlashCard Saas
      </Toolbar>
      <SignedOut>
        <Button color="inherit" href="/sign-in">Login</Button>
        <Button color="inherit" href="/sign-up">Sign  Up</Button>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </AppBar>
    <Box sx={{textAlign: 'center', my: 4}}>
      <Typography variant= "h2" component="h1" gutterBottom>
        Welcome to Flashcard SaaS
      </Typography>
      <Typography variant ="h5" component="h2" gutterBottom>
        The easiest way to create flashcards from your text.
      </Typography>
      <Button variant="contained" color="primary" sx={{mt: 2, mr: 2}} href="/generate">
        Get Started
      </Button>
      <Button variant="outlined" color="primary" sx={{mt: 2}}>
        Learn More
      </Button>
    </Box>
  </>
}
  