import { createFileRoute } from '@tanstack/react-router'

import React from 'react'
import { Box, Button, Container, Paper, Typography } from '@mui/material'

const OrderDetails: React.FC = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="grey.100">
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 5, textAlign: 'center' }}>
          {/* Return Button */}
          <Button
            variant="contained"
            color="info"
            sx={{ mb: 4, backgroundColor: '#50b7f5' }}
            onClick={() => window.history.back()}>
            Return
          </Button>

          {/* Title for Order ID */}
          <Typography variant="h5" component="h2" fontWeight="bold" mb={4}>
            Order ID: XYZ
          </Typography>

          {/* Order Status */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mb: 2, backgroundColor: '#3498db' }}>
            Order Status: Complete
          </Button>

          {/* View Results Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mb: 2, backgroundColor: '#3498db' }}>
            View Results
          </Button>

          {/* Download Results Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ backgroundColor: '#3498db' }}>
            Download Results
          </Button>
        </Paper>
      </Container>
    </Box>
  )
}

export const Route = createFileRoute('/order-details')({
  component: OrderDetails,
})
