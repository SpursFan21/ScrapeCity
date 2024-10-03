import React from 'react';
import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { useAuth, AuthProvider } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { isLoggedIn, user, handleLogout } = useAuth(); // Get auth context

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="fixed">
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h4" component={Link} to="/" color="inherit" sx={{ textDecoration: 'none' }}>
              Scrape City
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: "center" }}>
              {isLoggedIn ? (
                <>
                  <Button color="inherit" component={Link} to="/about">
                    About
                  </Button>
                  <Button color="inherit" component={Link} to="/contact">
                    Contact
                  </Button>
                  <Button color="inherit" component={Link} to="/scraping-order">
                    Scraping Order
                  </Button>
                  <Button color="inherit" component={Link} to="/account">
                    Account
                  </Button>
                  <Button color="inherit" onClick={handleLogout}>
                    Log-out
                  </Button>
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    Welcome, {user?.username}
                  </Typography>
                </>
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/about">
                    About
                  </Button>
                  <Button color="inherit" component={Link} to="/contact">
                    Contact
                  </Button>
                  <Button color="inherit" component={Link} to="/register">
                    Register
                  </Button>
                  <Button color="inherit" component={Link} to="/login">
                    Log-in
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, mt: 10 }}>
        <Outlet /> {/* This is where the nested routes will be rendered */}
      </Box>

      <TanStackRouterDevtools position="bottom-right" />
    </Box>
  );
}

// Wrap RootComponent in AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <RootComponent />
    </AuthProvider>
  );
}