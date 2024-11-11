import React, { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import ReactJsonPretty from 'react-json-pretty'
import 'react-json-pretty/themes/monikai.css'
import env from '../env'

// Function to fetch order details from the API
const fetchOrderDetails = async (orderId: string, token: string) => {
  const response = await axios.get(
    `${env.API_URL}/api/order-details/${orderId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return response.data
}

const OrderDetails: React.FC = () => {
  const { isLoggedIn } = useAuth()
  const [orderId, setOrderId] = useState<string | null>(null)
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Retrieve order ID from local storage
    const storedOrderId = localStorage.getItem('selectedOrderId')
    setOrderId(storedOrderId)

    // Fetch order details if orderId is present
    const fetchOrderDetailsData = async () => {
      if (storedOrderId && isLoggedIn) {
        const token = localStorage.getItem('accessToken')
        try {
          const details = await fetchOrderDetails(
            storedOrderId,
            token as string
          )
          // Parse raw_data if it's a string
          // if (details.raw_data && typeof details.raw_data === 'string') {
          //   details.raw_data = JSON.parse(details.raw_data);
          // }
          setOrderDetails(details)
        } catch (err) {
          console.error(err) // Log the error for debugging
          setError('Failed to fetch order details.')
        } finally {
          setLoading(false)
        }
      } else {
        setError('No order ID found or you are not logged in.')
        setLoading(false)
      }
    }

    fetchOrderDetailsData()
  }, [isLoggedIn]) // Fetch order details when isLoggedIn changes

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    )
  }

  if (!orderDetails) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh">
        <Typography variant="h6">No order details found.</Typography>
      </Box>
    )
  }

  // Define a local variable for orderId
  const currentOrderId = orderDetails.order_id

  // Extract the screenshot URL if it exists
  const screenshotUrl = orderDetails.raw_data?.info?.screenshot

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="grey.100">
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 5,
            textAlign: 'center',
            overflowY: 'auto',
            maxHeight: '80vh',
          }}>
          <Button
            variant="contained"
            color="info"
            sx={{ mb: 4, backgroundColor: '#50b7f5' }}
            onClick={() => window.history.back()}>
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
            <strong>Created At:</strong>{' '}
            {new Date(orderDetails.created_at).toLocaleString()}
          </Typography>

          {/* Display Screenshot Image if available */}
          {screenshotUrl && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                Screenshot:
              </Typography>
              <Box
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  p: 1,
                  backgroundColor: '#f9f9f9',
                }}>
                <img
                  src={screenshotUrl}
                  alt="Screenshot"
                  style={{
                    width: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            </Box>
          )}

          {/* Download Raw Data Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 4, mb: 2, backgroundColor: '#3498db' }}
            onClick={() => {
              const dataStr = JSON.stringify(
                orderDetails.raw_data || {},
                null,
                2
              )
              const blob = new Blob([dataStr], { type: 'application/json' })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `raw_data_${currentOrderId}.json`
              a.click()
              window.URL.revokeObjectURL(url)
            }}>
            Download Raw Data
          </Button>

          {/* View Cleaned Data Button */}
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ mb: 2, backgroundColor: '#2ecc71' }}
            onClick={() => {
              // Store current orderId in a local variable
              const cleanedOrderId = currentOrderId
              console.log(
                'Navigating to cleaned data for order:',
                cleanedOrderId
              )

              // Navigate to the cleaned data page
              window.location.href = `/cleaned-data/${cleanedOrderId}`
            }}>
            View Cleaned Data
          </Button>

          {/* Display Raw Data using ReactJsonPretty */}
          <Box sx={{ mt: 4, textAlign: 'left' }}>
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
              Raw Data:
            </Typography>
            <Box
              sx={{
                maxHeight: '50vh',
                overflowY: 'auto',
                border: '1px solid #ccc',
                borderRadius: '4px',
                p: 1,
                backgroundColor: '#2e2e2e',
              }}>
              <ReactJsonPretty data={orderDetails.raw_data} />
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

// Dynamic route for /order-details/:orderId
export const Route = createFileRoute('/order-details/$orderId')({
  component: OrderDetails,
})

export default OrderDetails
