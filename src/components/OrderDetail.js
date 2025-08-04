import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api'; // <-- Use the api service
import { Card, CardContent, Typography, Button, Box, CircularProgress, Chip, Grid, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // Use the api service to make the request
                const result = await api.get(`/orders/${id}`);
                setOrder(result.data);
            } catch (error) {
                console.error("Failed to fetch order details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }
    
    if (!order) {
        return <Typography variant="h5" align="center">Order not found.</Typography>;
    }

    return (
        <Card sx={{ maxWidth: 700, margin: 'auto' }}>
            <CardContent>
                <Typography variant="h4" gutterBottom component="div">
                    Order Details
                </Typography>
                <Chip label={`ID: ${order._id}`} color="primary" sx={{ mb: 2 }} />
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.secondary">Customer Name:</Typography>
                        <Typography variant="h6">{order.customerName}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.secondary">Customer Email:</Typography>
                        <Typography variant="h6">{order.customerEmail}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.secondary">Order Amount:</Typography>
                        <Typography variant="h6">${order.orderAmount.toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography color="text.secondary">Order Date:</Typography>
                        <Typography variant="h6">{new Date(order.orderDate).toLocaleString()}</Typography>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        href={order.invoiceFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Download Invoice
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default OrderDetail;