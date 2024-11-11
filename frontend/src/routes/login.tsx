import React, { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import axios from 'axios'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Link as MuiLink,
} from '@mui/material'
import env from '../env'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const response = await axios.post(`${env.API_URL}/api/login/`, {
        username,
        password,
      })

      const { access, refresh } = response.data
      // Store the tokens in localStorage
      localStorage.setItem('accessToken', access)
      localStorage.setItem('refreshToken', refresh)

      // Verify the token and update user data in AuthContext
      const userResponse = await axios.post(
        `${env.API_URL}/api/verify-token/`,
        {},
        {
          headers: { Authorization: `Bearer ${access}` },
        }
      )

      setUser(userResponse.data.decoded) // Set the user data in AuthContext

      // Navigate to the homepage or dashboard after successful login
      navigate({ to: '/' })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error || 'Login failed.')
      } else {
        setError('An unexpected error occurred.')
      }
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="grey.100">
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 5 }}>
          <Typography variant="h4" textAlign="center" mb={3}>
            Log in
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate>
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
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2}>
              <Button type="submit" variant="contained" color="primary">
                Log in
              </Button>
              <MuiLink
                component={Link}
                to="/register"
                color="inherit"
                underline="hover">
                Register
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default LoginPage
