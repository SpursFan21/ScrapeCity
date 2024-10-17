import React, { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Box, Button, Container, Paper, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Function to fetch order details from the API
const fetchOrderDetails = async (orderId: string, token: string) => {
  const response = await axios.get(`http://127.0.0.1:8000/api/order-details/${orderId}/`, {  
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const OrderDetails: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve order ID from local storage
    const storedOrderId = localStorage.getItem('selectedOrderId');
    setOrderId(storedOrderId);
    
    // Fetch order details if orderId is present
    const fetchOrderDetailsData = async () => {
      if (storedOrderId && isLoggedIn) {
        const token = localStorage.getItem('accessToken'); // Fetch token from localStorage
        try {
          const details = await fetchOrderDetails(storedOrderId, token as string);
          setOrderDetails(details);
        } catch (err) {
          console.error(err); // Log the error for debugging
          setError('Failed to fetch order details.');
        } finally {
          setLoading(false);
        }
      } else {
        setError('No order ID found or you are not logged in.');
        setLoading(false);
      }
    };

    fetchOrderDetailsData();
  }, [isLoggedIn]); // Fetch order details when isLoggedIn changes

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

  if (!orderDetails) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6">No order details found.</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="grey.100">
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 5, textAlign: 'center', overflowY: 'auto', maxHeight: '80vh' }}>
          <Button
            variant="contained"
            color="info"
            sx={{ mb: 4, backgroundColor: '#50b7f5' }}
            onClick={() => window.history.back()}
          >
            Return
          </Button>

          {/* Dynamic Title for Order ID */}
          <Typography variant="h5" component="h2" fontWeight="bold" mb={4}>
            Order ID: {orderDetails.order_id}
          </Typography>

          {/* Display other order details */}
          <Typography variant="body1" component="div" sx={{ mb: 2 }}>
            <strong>URL:</strong> {orderDetails.url}
          </Typography>
          <Typography variant="body1" component="div" sx={{ mb: 2 }}>
            <strong>Geo:</strong> {orderDetails.geo}
          </Typography>
          <Typography variant="body1" component="div" sx={{ mb: 2 }}>
            <strong>Retry Count:</strong> {orderDetails.retry_num}
          </Typography>
          <Typography variant="body1" component="div" sx={{ mb: 2 }}>
            <strong>Created At:</strong> {new Date(orderDetails.created_at).toLocaleString()}
          </Typography>

          {/* Display Raw Data */}
          <Typography variant="body1" component="div" sx={{ mb: 2 }}>
            <strong>Raw Data:</strong>
            <Box sx={{ whiteSpace: 'pre-wrap', overflowX: 'auto', border: '1px solid #ccc', borderRadius: '4px', p: 1 }}>
              {JSON.stringify(orderDetails.raw_data, null, 2)}
            </Box>
          </Typography>

          {/* View Results Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mb: 2, backgroundColor: '#3498db' }}
          >
            View Results
          </Button>

          {/* Download Results Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ backgroundColor: '#3498db' }}
          >
            Download Results
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

// Dynamic route for /order-details/:orderId
export const Route = createFileRoute('/order-details/$orderId')({
  component: OrderDetails,
});

export default OrderDetails;
