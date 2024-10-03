import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
} from '@mui/material';

const ScrapingOrder: React.FC = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="grey.100">
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" fontWeight="bold" mb={4}>
            Scraping Order Menu
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <Button variant="contained" color="primary" fullWidth>
              New Scraping Order
            </Button>
            <Button variant="contained" color="primary" fullWidth>
              Current Orders
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export const Route = createFileRoute('/scraping-order')({
  component: ScrapingOrder,
});

export default ScrapingOrder;