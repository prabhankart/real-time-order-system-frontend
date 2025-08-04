import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { 
    Grid, 
    Card, 
    CardContent, 
    CardMedia, 
    Typography, 
    Box, 
    Button, 
    CardActions,
    Rating,
    Skeleton,
    Link as MuiLink
} from '@mui/material';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
                const res = await api.get('/api/products');
                setProducts(res.data);
            } catch (err) {
                console.error("Failed to fetch products", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const renderSkeletons = () => (
        Array.from(new Array(8)).map((item, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ height: '100%' }}>
                    <Skeleton variant="rectangular" height={220} />
                    <CardContent>
                        <Skeleton variant="text" sx={{ fontSize: '1.25rem' }} />
                        <Skeleton variant="text" />
                        <Skeleton variant="text" width="60%" />
                    </CardContent>
                </Card>
            </Grid>
        ))
    );

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                Results
            </Typography>
            <Grid container spacing={3}>
                {loading ? renderSkeletons() : products.map((product) => (
                    <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardMedia
                                component="img"
                                sx={{ height: 220, objectFit: 'contain', p: 2 }}
                                image={product.imageUrl}
                                alt={product.name}
                            />
                            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                <MuiLink href="#" underline="hover" sx={{ color: 'inherit' }}>
                                    <Typography gutterBottom variant="body1" component="div" sx={{ fontWeight: '500', height: '3em' }}>
                                        {product.name}
                                    </Typography>
                                </MuiLink>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Rating name="read-only" value={4.5} precision={0.5} readOnly size="small" />
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                        (1,234)
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1 }}>
                                    <Typography variant="h5" color="text.primary" sx={{ fontWeight: 'bold' }}>
                                        ₹{product.price.toLocaleString('en-IN')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through', ml: 1 }}>
                                        ₹{(product.price * 1.4).toLocaleString('en-IN')}
                                    </Typography>
                                </Box>
                            </CardContent>
                            <CardActions sx={{ p: 2, mt: 'auto' }}>
                                <Button 
                                    fullWidth
                                    variant="contained" 
                                    onClick={() => addToCart(product)}
                                    sx={{ 
                                        backgroundColor: '#FFD814', 
                                        color: '#0F1111',
                                        '&:hover': { backgroundColor: '#F7CA00' }
                                    }}
                                >
                                    Add to Cart
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ProductsPage;