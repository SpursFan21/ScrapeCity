import React, { useEffect, useState } from 'react';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import axios from 'axios';

const OrderDetails: React.FC = () => {
  // Get the orderId from the route params
  const { orderId } = useParams({ from: '/order-details/$orderId' });

  // State to hold order details and loading status
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/scraping-order/${orderId}`);
        setOrderDetails(response.data);
      } catch (err) {
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Render loading state
  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        bgcolor="grey.100"
      >
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        bgcolor="grey.100"
      >
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="grey.100"
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 5, textAlign: 'center' }}>
          {/* Return Button */}
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
            Order ID: {orderDetails?.id}
          </Typography>

          {/* Order Status */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mb: 2, backgroundColor: '#3498db' }}
          >
            Order Status: {orderDetails?.status || 'Unknown'}
          </Button>

          {/* Display Raw Data */}
          <Typography variant="body1" component="div" sx={{ mb: 2 }}>
            <strong>Raw Data:</strong>
            <pre>{JSON.stringify(orderDetails?.raw_data, null, 2)}</pre>
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
