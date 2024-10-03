import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Container,
  Typography,
  Paper,
} from '@mui/material';

const HomeComponent: React.FC = () => {
  const { isLoggedIn, user } = useAuth(); // Destructure auth context values

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="grey.100">
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Scraping Made Easy
          </Typography>
          <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
            Welcome to Scrape City - Your Gateway to Effortless Data Extraction
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            At Scrape City, we simplify the world of web scraping, making it accessible
            and efficient for everyone. Our cutting-edge platform is designed to handle
            all your data extraction needs, allowing you to focus on what matters most: analyzing and utilizing your data.
          </Typography>

          {/* Show different messages depending on login status */}
          {isLoggedIn ? (
            <Box mt={4}>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Welcome back, {user?.username}!
              </Typography>
              <Typography variant="h6">We're glad to have you back!</Typography>
            </Box>
          ) : (
            <Box mt={4}>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Join Us!
              </Typography>
              <Typography variant="h6">Sign in or register to start scraping with us!</Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export const Route = createFileRoute('/')({
  component: HomeComponent,
});