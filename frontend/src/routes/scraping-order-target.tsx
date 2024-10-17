import React, { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';

const ScrapingOrder: React.FC = () => {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleProceed = () => {
    if (url) {
      // Save URL and hardcoded parameters to localStorage
      localStorage.setItem('scrapeData', JSON.stringify({
        url: url,
        geo: 'us',     // Hardcoded value
        retryNum: 1    // Hardcoded value
      }));

      navigate({ to: '/payment-page' });
    } else {
      alert('Please enter a valid URL.');
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
        <Paper elevation={3} sx={{ p: 5, textAlign: 'center', backgroundColor: '#3498db' }}>
          <Button
            variant="contained"
            color="info"
            sx={{ mb: 2, backgroundColor: '#50b7f5' }}
            onClick={() => window.history.back()}
          >
            Return
          </Button>
          <Typography variant="h5" component="h2" fontWeight="bold" color="white" mb={4}>
            Scrape Target
          </Typography>

          {/* Form Fields */}
          <Box component="form" display="flex" flexDirection="column" gap={2}>
            <TextField
              label="URL"
              variant="filled"
              fullWidth
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              InputProps={{
                sx: { bgcolor: 'white' },
              }}
            />

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, bgcolor: '#00aeff' }}
              onClick={handleProceed}
            >
              Proceed To Payment
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export const Route = createFileRoute('/scraping-order-target')({
  component: ScrapingOrder,
});

export default ScrapingOrder;
