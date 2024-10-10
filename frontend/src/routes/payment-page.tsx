import { createFileRoute } from '@tanstack/react-router'

import React from 'react'
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material'

const PaymentPage: React.FC = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="grey.100">
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{ p: 5, textAlign: 'center', backgroundColor: '#3498db' }}>
          {/* Return Button */}
          <Button
            variant="contained"
            color="info"
            sx={{ mb: 2, backgroundColor: '#50b7f5' }}
            onClick={() => window.history.back()}>
            Return
          </Button>

          {/* Order Summary Title */}
          <Typography
            variant="h5"
            component="h2"
            fontWeight="bold"
            color="white"
            mb={4}>
            Order Summary
          </Typography>

          {/* Displaying URL and Parameters */}
          <Typography variant="body1" color="white" mb={2}>
            Url: Some Url
          </Typography>
          <Typography variant="body1" color="white" mb={2}>
            Parameter 1: XYZ
          </Typography>
          <Typography variant="body1" color="white" mb={2}>
            Parameter 2: ABC
          </Typography>

          {/* Voucher Code Input */}
          <Box component="form" display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Voucher Code"
              variant="filled"
              fullWidth
              InputProps={{
                sx: { bgcolor: 'white' },
              }}
            />

            {/* Pay Now Button */}
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, bgcolor: '#00aeff' }}>
              Pay Now
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export const Route = createFileRoute('/payment-page')({
  component: PaymentPage,
})
