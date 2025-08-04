import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Box, Typography, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, Button, Divider, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

const CartPage = () => {
    const { cartItems, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();

    const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

    const handleCheckout = async () => {
        try {
            const { data: order } = await api.post('/api/payment/create-order', { amount: totalPrice });

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Use environment variable
                amount: order.amount,
                currency: order.currency,
                name: "Your Store Name",
                description: "Order Payment",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        await api.post('/api/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            cartItems,
                        });
                        toast.success("Payment successful!");
                        clearCart();
                        navigate('/');
                    } catch (err) {
                        toast.error("Payment verification failed.");
                    }
                },
                prefill: {
                    // You can prefill customer info here from a user profile
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            toast.error("Failed to initiate payment.");
        }
    };

    return (
        <Paper sx={{ p: 4, maxWidth: 800, margin: 'auto' }}>
            <Typography variant="h4" gutterBottom>Your Shopping Cart</Typography>
            {cartItems.length === 0 ? (
                <Typography>Your cart is empty.</Typography>
            ) : (
                <Box>
                    <List>
                        {cartItems.map(item => (
                            <ListItem key={item._id} secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(item._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            }>
                                <ListItemAvatar>
                                    <Avatar src={item.imageUrl} variant="square" />
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={item.name} 
                                    secondary={`$${item.price.toFixed(2)}`} 
                                />
                            </ListItem>
                        ))}
                    </List>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', my: 2 }}>
                        <Typography variant="h6" sx={{ mr: 2 }}>Total:</Typography>
                        <Typography variant="h5" color="primary">${totalPrice.toFixed(2)}</Typography>
                    </Box>
                    <Button 
                        variant="contained" 
                        fullWidth 
                        sx={{ mt: 2 }} 
                        startIcon={<ShoppingCartCheckoutIcon />}
                        onClick={handleCheckout}
                    >
                        Proceed to Checkout
                    </Button>
                </Box>
            )}
        </Paper>
    );
};

export default CartPage;
