import { createFileRoute } from '@tanstack/react-router'

import React from 'react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';

const ScrapingOrders: React.FC = () => {
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

          {/* Title */}
          <Typography variant="h5" component="h2" fontWeight="bold" mb={4}>
            Your Scrapping Orders
          </Typography>

          {/* Order Buttons */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mb: 2, backgroundColor: '#3498db' }}
          >
            Order ID: ABC
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mb: 2, backgroundColor: '#3498db' }}
          >
            Order ID: XYZ
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mb: 2, backgroundColor: '#3498db' }}
          >
            Order ID: 123
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};


export const Route = createFileRoute('/scraping-orders')({
  component: ScrapingOrders
})
