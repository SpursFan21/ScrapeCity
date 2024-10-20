import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from 'context/AuthContext'

const CleanedDataComponent: React.FC = () => {
  // const { isLoggedIn } = useAuth();
  const { orderId } = Route.useParams()

  // Mock data for demonstration purposes
  const cleanedData = {
    orderId,
    url: 'https://example.com',
    createdAt: '2023-10-24',
    data: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi finibus rhoncus odio tempus egestas. Quisque a lacinia justo. Mauris et viverra diam, eget luctus risus. Nullam dolor lacus, vehicula a libero nec, iaculis facilisis erat. Phasellus tristique, leo nec varius lobortis, massa erat accumsan lorem, a feugiat nulla felis non augue. Donec sapien quam, rhoncus in sagittis in, eleifend commodo sapien. Curabitur orci purus, pharetra sit amet sapien eu, euismod eleifend mauris. Nullam commodo vehicula ligula, nec pharetra purus imperdiet a. Duis vitae ornare erat. Nulla magna tortor, posuere at ligula sit amet, mollis tincidunt urna. Duis justo quam, congue et risus vitae, sollicitudin tempus magna. Vivamus pretium risus sit amet dui consectetur volutpat. Ut facilisis arcu eget cursus imperdiet.

Nullam posuere sapien nibh, eu tristique purus tincidunt tincidunt. Nunc risus nibh, convallis in nisl eget, blandit bibendum turpis. Nulla a nisi dignissim, lobortis lacus vitae, tempor orci. Quisque eget efficitur purus, ut tempus libero. Aliquam dignissim magna sed felis pellentesque rhoncus. Integer venenatis metus non luctus eleifend. Cras eleifend lectus ut convallis vestibulum. Donec bibendum eleifend imperdiet. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum a leo ac magna elementum hendrerit. Suspendisse potenti. Sed non ligula purus. Vivamus interdum sagittis convallis. Nulla sagittis convallis neque, id tincidunt nisl condimentum sed. Proin lobortis leo in erat gravida scelerisque.

Vestibulum vitae lacus eget ipsum pretium aliquam vitae nec sapien. Quisque vestibulum ultricies mauris, at consectetur justo ullamcorper nec. Donec tempus velit eget convallis aliquet. In libero nisi, auctor a orci in, porta pulvinar orci. Aliquam turpis nisi, ornare fringilla dui ullamcorper, rhoncus tincidunt metus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et scelerisque augue. In vel iaculis odio, quis convallis orci. Phasellus luctus tellus ac lacinia egestas. Cras ante urna, viverra eu arcu at, facilisis placerat.`,
  }

  // Redirect or inform the user if they're not logged in
  // if (!isLoggedIn) {
  //   return (
  //     <Box display="flex" justifyContent="center" mt={4}>
  //       <Typography variant="h6">Please log in to view the cleaned data.</Typography>
  //     </Box>
  //   );
  // }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="grey.100">
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 5 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Cleaned Data from Web Scraping Job
          </Typography>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell variant="head">
                  <Typography variant="h6">Order ID:</Typography>
                </TableCell>
                <TableCell>{cleanedData.orderId}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">
                  <Typography variant="h6">URL:</Typography>
                </TableCell>
                <TableCell>{cleanedData.url}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">
                  <Typography variant="h6">Created At:</Typography>
                </TableCell>
                <TableCell>{cleanedData.createdAt}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography variant="h6" gutterBottom>
                    Cleaned Data:
                  </Typography>
                  <Typography variant="body1">{cleanedData.data}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </Box>
  )
}

export const Route = createFileRoute('/cleaned-data/$orderId')({
  component: CleanedDataComponent,
})
