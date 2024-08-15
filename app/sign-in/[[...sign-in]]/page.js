import { Container, AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <Container maxWidth ="100vw">
            <AppBar position="static" >
                <Toolbar>
                    <Typography variant="h6" component="h1">
                        Flashcard SaaS
                    </Typography>
                    <Button color="inherit">
                        <Link href="/sign-in" passHref>
                            Login
                        </Link>
                    </Button>
                    <Button color="inherit">
                        <Link href="/sign-up" passHref>
                            Sign Up
                        </Link>
                    </Button>
                </Toolbar>
            </AppBar>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="calc(100vh - 64px)"
            >
                <Typography variant="h4" component="h1">
                    Sign In
                </Typography>
                <SignIn/>
            </Box>
        </Container>
    )
}