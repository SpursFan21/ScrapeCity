import { createFileRoute } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Snackbar,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '@tanstack/react-router';

const PaymentPage: React.FC = () => {
  const { user, isLoggedIn } = useAuth();
  const [scrapeData, setScrapeData] = useState<{
    url: string;
    geo: string;
    retryNum: number;
  } | null>(null);
  const [voucher, setVoucher] = useState('');
  const [loading, setLoading] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const router = useRouter();

  // Retrieve the URL and parameters from localStorage when the component mounts
  useEffect(() => {
    const storedData = localStorage.getItem('scrapeData');
    if (storedData) {
      setScrapeData(JSON.parse(storedData));
    }
  }, []);

  const handlePayment = async () => {
    if (!voucher) {
      alert('Please enter a voucher code.');
      return;
    }

    if (!scrapeData) {
      alert('Missing scrape data. Please go back and enter the URL.');
      return;
    }

    if (!isLoggedIn) {
      alert('You must be logged in to make this request.');
      return;
    }

    const token = localStorage.getItem('accessToken');

    if (!token) {
      alert('Authorization token missing. Please log in again.');
      return;
    }

    setLoading(true);

    try {
      // Make API request to the backend for scraping
      const response = await axios.post(
        'http://127.0.0.1:8000/api/scrape/',
        {
          url: scrapeData.url,
          geo: scrapeData.geo,
          retryNum: scrapeData.retryNum,
          voucher_code: voucher,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Show notification popup
        setNotificationOpen(true);
        // Redirect to /scraping-order after 5 seconds
        setTimeout(() => {
          router.navigate({ to: '/scraping-order' });
        }, 5000);
      } else {
        alert('Failed to initiate scraping.');
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Error during scraping request:', error.response || error.message);
        alert(`Error during scraping process: ${error.message}`);
      } else {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="grey.100"
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{ p: 5, textAlign: 'center', backgroundColor: '#3498db' }}
        >
          {/* Return Button */}
          <Button
            variant="contained"
            color="info"
            sx={{ mb: 2, backgroundColor: '#50b7f5' }}
            onClick={() => window.history.back()}
          >
            Return
          </Button>

          {/* Order Summary Title */}
          <Typography
            variant="h5"
            component="h2"
            fontWeight="bold"
            color="white"
            mb={4}
          >
            Order Summary
          </Typography>

          {/* Displaying URL and Parameters */}
          {scrapeData ? (
            <>
              <Typography variant="body1" color="white" mb={2}>
                Url: {scrapeData.url}
              </Typography>
              <Typography variant="body1" color="white" mb={2}>
                Geo: {scrapeData.geo}
              </Typography>
              <Typography variant="body1" color="white" mb={2}>
                Retry Number: {scrapeData.retryNum}
              </Typography>
            </>
          ) : (
            <Typography variant="body1" color="white" mb={2}>
              No order data available.
            </Typography>
          )}

          {/* Voucher Code Input */}
          <Box component="form" display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Voucher Code"
              variant="filled"
              fullWidth
              value={voucher}
              onChange={(e) => setVoucher(e.target.value)}
              InputProps={{
                sx: { bgcolor: 'white' },
              }}
            />

            {/* Pay Now Button */}
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, bgcolor: '#00aeff' }}
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Notification Popup */}
      <Snackbar
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        message="Scraping process initiated successfully."
        autoHideDuration={5000}
      />
    </Box>
  );
};

export const Route = createFileRoute('/payment-page')({
  component: PaymentPage,
});

export default PaymentPage;
