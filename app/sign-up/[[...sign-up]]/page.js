import { Container, AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import { SignUp } from "@clerk/nextjs";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/app/theme';

export default function SignUpPage() {
    return (

        <ThemeProvider theme={theme}>
            <CssBaseline />
                <Box maxWidth ="100vw">
                    <AppBar position="sticky" elevation={8} sx={{
                        background: 'transparent',
                        boxShadow: 'none',
                        borderBottom: '1px solid',
                        borderColor: 'white',
                        borderRadius: 4,
                        width: '100%',
                        position: 'sticky',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 24,
                        fontFamily: 'Arial, sans-serif',
                        padding: 2,
                        margin: 0,
                    }}>
                        <Toolbar>
                            <Typography variant="h6" component="h1">
                                Flashcard SaaS
                            </Typography>
                            <Box sx={{ flexGrow: 1 }} />
                            <Button color="inherit" component={Link} href="/" passHref>
                                    Home
                            </Button>
                            <Button color="inherit" component={Link} href="/sign-in" passHref>
                                    Login
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        minHeight="calc(100vh - 150px)"
                    >
                        <Typography variant="h4" component="h1" marginBottom={2}>
                            Sign Up
                        </Typography>
                        <SignUp/>
                    </Box>
            </Box>
        </ThemeProvider>
    )
}