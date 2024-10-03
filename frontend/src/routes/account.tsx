import React, { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
} from '@mui/material';

export const Route = createFileRoute('/account')({
  component: AccountPage,
});

function AccountPage() {
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    password: '',
    newPassword: '',
  });
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  const { user, isLoggedIn } = useAuth(); // Get user info and login status from AuthContext

  const maskPassword = (password: string) => '*'.repeat(password.length);

  useEffect(() => {
    if (isLoggedIn && user) {
      setUserDetails({
        username: user.username,
        email: user.email || '',
        password: '123super', // Placeholder for the actual password
        newPassword: '', // Initially empty
      });
    }
  }, [user, isLoggedIn]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const updatedUserData = {
        username: userDetails.username,
        email: userDetails.email,
        password: userDetails.newPassword,
      };

      await axios.put('http://127.0.0.1:8000/api/update-account/', updatedUserData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEditing(false);
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  if (!isLoggedIn) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h4">You need to log in to view your account details</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="grey.100">
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
            Account Details
          </Typography>
          {!editing ? (
            <Box>
              <Grid container spacing={2} mb={3}>
                <Grid item xs={12}>
                  <Typography variant="body1" fontWeight="bold">Username:</Typography>
                  <Typography variant="body1" sx={{ border: '1px solid', p: 1, borderRadius: 1 }}>{userDetails.username}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" fontWeight="bold">Email:</Typography>
                  <Typography variant="body1" sx={{ border: '1px solid', p: 1, borderRadius: 1 }}>{userDetails.email}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" fontWeight="bold">Password:</Typography>
                  <Typography variant="body1" sx={{ border: '1px solid', p: 1, borderRadius: 1 }}>{maskPassword(userDetails.password)}</Typography>
                </Grid>
              </Grid>
              <Button variant="contained" color="primary" fullWidth onClick={handleEdit}>
                Edit Details
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleUpdate}>
              <Grid container spacing={2} mb={3}>
                <Grid item xs={12}>
                  <TextField
                    label="New Username"
                    variant="outlined"
                    fullWidth
                    value={userDetails.username}
                    onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="New Email"
                    variant="outlined"
                    fullWidth
                    value={userDetails.email}
                    onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="New Password (optional)"
                    variant="outlined"
                    type="password"
                    fullWidth
                    value={userDetails.newPassword}
                    onChange={(e) => setUserDetails({ ...userDetails, newPassword: e.target.value })}
                  />
                </Grid>
              </Grid>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Update Details
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default AccountPage;