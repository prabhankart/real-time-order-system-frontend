import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        backgroundColor: '#232F3E', // Amazon-like dark blue
        color: 'white',
        py: 6,
        mt: 'auto' // Pushes footer to the bottom
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              ShopCart
            </Typography>
            <Typography variant="body2" color="#DDDDDD">
              Your one-stop shop for everything you need. Quality products, unbeatable prices.
            </Typography>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Typography variant="h6" gutterBottom>
              Links
            </Typography>
            <Link href="/" color="inherit" display="block" underline="hover">Home</Link>
            <Link href="/products" color="inherit" display="block" underline="hover">Products</Link>
            <Link href="/cart" color="inherit" display="block" underline="hover">Cart</Link>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="h6" gutterBottom>
              Customer Service
            </Typography>
            <Link href="#" color="inherit" display="block" underline="hover">Contact Us</Link>
            <Link href="#" color="inherit" display="block" underline="hover">FAQs</Link>
            <Link href="#" color="inherit" display="block" underline="hover">Shipping & Returns</Link>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <IconButton href="#" color="inherit"><FacebookIcon /></IconButton>
            <IconButton href="#" color="inherit"><TwitterIcon /></IconButton>
            <IconButton href="#" color="inherit"><InstagramIcon /></IconButton>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" color="#AAAAAA" align="center">
            {'© '}
            {new Date().getFullYear()}
            {' ShopCart. All rights reserved.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
