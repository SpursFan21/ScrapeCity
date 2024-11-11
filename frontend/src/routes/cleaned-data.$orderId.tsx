import React, { useEffect, useState } from 'react'
import { Box, Button, Container, Paper, Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import ReactJsonPretty from 'react-json-pretty'
import 'react-json-pretty/themes/monikai.css'
import env from '../env'

const fetchCleanedData = async (orderId: string, token: string) => {
  const response = await axios.post(
    `${env.API_URL}/api/clean-data/${orderId}/`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return response.data
}

const CleanedDataComponent: React.FC = () => {
  const { isLoggedIn } = useAuth()
  const { orderId } = Route.useParams()
  const [cleanedData, setCleanedData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn) {
        const token = localStorage.getItem('accessToken')
        if (token) {
          try {
            const data = await fetchCleanedData(orderId, token)
            // Ensure cleaned_data is parsed correctly
            // if (data.cleaned_data && typeof data.cleaned_data === 'string') {
            //   data.cleaned_data = JSON.parse(data.cleaned_data);
            // }
            setCleanedData(data)
          } catch (err: any) {
            console.error('Failed to fetch cleaned data:', err)
            if (err.response?.status === 404) {
              setError('Order not found.')
            } else {
              setError('Failed to fetch cleaned data.')
            }
          } finally {
            setLoading(false)
          }
        } else {
          setError('No authentication token found.')
          setLoading(false)
        }
      } else {
        setError('You are not logged in.')
        setLoading(false)
      }
    }

    fetchData()
  }, [isLoggedIn, orderId])

  const handleDownload = () => {
    const dataStr = JSON.stringify(cleanedData?.cleaned_data || {}, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cleaned_data_${orderId}.json`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh">
        <Typography variant="h6">Loading...</Typography>
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

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="80vh"
      bgcolor="grey.100">
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 5, my: 5 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Cleaned Data from Web Scraping Job
          </Typography>

          {/* Button Box for Return and Download Buttons */}
          <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
            <Button variant="contained" onClick={() => window.history.back()}>
              Return
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownload}>
              Download Clean Data
            </Button>
          </Box>

          {/* Display the Cleaned Data */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Order ID: {cleanedData?.cleaned_order_id || 'N/A'}
            </Typography>
            <Typography variant="h3" paddingTop={3}>
              Cleaned Data:
            </Typography>
            <Box
              sx={{
                maxHeight: '70vh',
                overflowY: 'auto',
                border: '1px solid #ccc',
                borderRadius: '4px',
                p: 2,
                backgroundColor: '#2e2e2e',
              }}>
              {cleanedData?.cleaned_data ? (
                <ReactJsonPretty data={cleanedData.cleaned_data} />
              ) : (
                <Typography>No data available.</Typography>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export const Route = createFileRoute('/cleaned-data/$orderId')({
  component: CleanedDataComponent,
})

export default CleanedDataComponent
