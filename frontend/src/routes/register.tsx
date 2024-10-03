import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Link as MuiLink,
} from '@mui/material';

export const Route = createFileRoute('/register')({
  component: RegisterPage,
});

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Prepare payload for the POST request
    const payload = {
      email,
      username,
      password,
    };

    try {
      // Make the POST request to the Django backend
      const response = await axios.post('http://127.0.0.1:8000/api/register/', payload, {
        headers: {
          'Content-Type': 'application/json', // Ensure correct Content-Type
        },
      });

      console.log(response.data);
      // Navigate to login page after successful registration
      navigate({ to: '/login' });
    } catch (error) {
      // Handle potential errors
      if (axios.isAxiosError(error)) {
        const errorMsg = error.response?.data.error || error.response?.data.message || 'Registration failed.';
        setError(errorMsg);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="grey.100">
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 5 }}>
          <Typography variant="h4" textAlign="center" mb={3}>
            Register
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              margin="normal"
              InputProps={{ style: { backgroundColor: 'white' } }}
            />
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              margin="normal"
              InputProps={{ style: { backgroundColor: 'white' } }}
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              margin="normal"
              InputProps={{ style: { backgroundColor: 'white' } }}
            />
            <TextField
              label="Re-Enter Password"
              variant="outlined"
              fullWidth
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              margin="normal"
              InputProps={{ style: { backgroundColor: 'white' } }}
            />
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
              <Button type="submit" variant="contained" color="primary">
                Register
              </Button>
              <MuiLink component={Link} to="/login" color="inherit" underline="hover">
                Login
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default RegisterPage;