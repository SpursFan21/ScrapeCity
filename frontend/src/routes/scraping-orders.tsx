import React, { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Box, Button, Container, Paper, Typography, CircularProgress, Snackbar, Checkbox } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '@tanstack/react-router';

const ScrapingOrders: React.FC = () => {
  const { user, isLoggedIn } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [emptyOrderNotification, setEmptyOrderNotification] = useState<boolean>(false);
  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const router = useRouter();

  const fetchOrders = async () => {
    const token = localStorage.getItem('accessToken');
    if (!isLoggedIn || !token) {
      setError('You must be logged in to view orders.');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/scraping-orders/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
      if (response.data.length === 0) {
        setEmptyOrderNotification(true);
      }
    } catch (error) {
      setError('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderClick = (orderId: string) => {
    localStorage.setItem('selectedOrderId', orderId);
    router.navigate({ to: `/order-details/${orderId}` });
  };

  const handleDeleteToggle = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedOrders([]);
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId) ? prevSelected.filter(id => id !== orderId) : [...prevSelected, orderId]
    );
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
  
    try {
      await axios.delete('http://127.0.0.1:8000/api/delete-orders/', {
        headers: { Authorization: `Bearer ${token}` },
        data: { order_ids: selectedOrders }, // Send selected order IDs in a single request
      });
  
      // Update the orders list to remove the deleted orders
      setOrders(orders.filter(order => !selectedOrders.includes(order.order_id)));
      setSelectedOrders([]);
      setIsDeleteMode(false);
    } catch (error) {
      setError('Failed to delete selected orders.');
    }
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

          <Button
            variant="contained"
            color="secondary"
            sx={{ mb: 2 }}
            onClick={handleDeleteToggle}
          >
            {isDeleteMode ? 'Cancel Delete' : 'Delete Orders'}
          </Button>

          {orders.length > 0 ? (
            orders.map((order) => (
              <Box key={order.order_id} display="flex" alignItems="center" mb={2}>
                {isDeleteMode && (
                  <Checkbox
                    checked={selectedOrders.includes(order.order_id)}
                    onChange={() => handleSelectOrder(order.order_id)}
                  />
                )}
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ backgroundColor: '#3498db', ml: isDeleteMode ? 1 : 0 }}
                  onClick={() => !isDeleteMode && handleOrderClick(order.order_id)}
                >
                  Order ID: {order.order_id} <br />
                  URL: {order.url}
                </Button>
              </Box>
            ))
          ) : (
            <Typography>No scraping orders available.</Typography>
          )}

          {isDeleteMode && (
            <Button
              variant="contained"
              color="error"
              sx={{ mt: 2 }}
              onClick={handleConfirmDelete}
              disabled={selectedOrders.length === 0}
            >
              Confirm Delete
            </Button>
          )}
        </Paper>
      </Container>

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
