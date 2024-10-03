import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Box, Container, Typography, Paper } from '@mui/material';

export const Route = createFileRoute('/about')({
  component: AboutComponent,
});

function AboutComponent() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="grey.100"
    >
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            About Scrape City
          </Typography>
          {/* TODO */}
        </Paper>
      </Container>
    </Box>
  );
}

export default AboutComponent;
