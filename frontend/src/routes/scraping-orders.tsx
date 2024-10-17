import React, { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Box, Button, Container, Paper, Typography, CircularProgress, Snackbar } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '@tanstack/react-router';

const ScrapingOrders: React.FC = () => {
  const { user, isLoggedIn } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [emptyOrderNotification, setEmptyOrderNotification] = useState<boolean>(false);
  const router = useRouter();

  // Fetch orders from the server
  const fetchOrders = async () => {
    const token = localStorage.getItem('accessToken'); // Fetch token from localStorage

    if (!isLoggedIn || !token) {
      setError('You must be logged in to view orders.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/scraping-orders/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);

      // Check if there are no orders
      if (response.data.length === 0) {
        setEmptyOrderNotification(true); // Show the empty orders notification
      }
    } catch (error) {
      setError('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []); // Fetch orders once on component mount

  const handleOrderClick = (orderId: string) => {
    // Save the order ID to local storage
    localStorage.setItem('selectedOrderId', orderId);

    // Navigate to the dynamic order details page with the order ID
    router.navigate({ to: `/order-details/${orderId}` });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="grey.100">
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 5, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="info"
            sx={{ mb: 4, backgroundColor: '#50b7f5' }}
            onClick={() => window.history.back()}
          >
            Return
          </Button>
          <Typography variant="h5" component="h2" fontWeight="bold" mb={4}>
            Your Scraping Orders
          </Typography>
          {orders.length > 0 ? (
            orders.map((order) => (
              <Button
                key={order.order_id} // Use order_id as the key
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mb: 2, backgroundColor: '#3498db' }}
                onClick={() => handleOrderClick(order.order_id)}
              >
                {/* Display both Order ID and URL */}
                Order ID: {order.order_id} <br />
                URL: {order.url}
              </Button>
            ))
          ) : (
            <Typography>No scraping orders available.</Typography>
          )}
        </Paper>
      </Container>

      {/* Snackbar for empty orders notification */}
      <Snackbar
        open={emptyOrderNotification}
        onClose={() => setEmptyOrderNotification(false)}
        message="You don't have any orders."
        autoHideDuration={3000}
      />
    </Box>
  );
};

export const Route = createFileRoute('/scraping-orders')({
  component: ScrapingOrders,
});

export default ScrapingOrders;
