import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const CreateOrder = () => {
    const [customerName, setCustomerName] = useState('');
    const [orderAmount, setOrderAmount] = useState('');
    const [invoice, setInvoice] = useState(null);
    const [fileName, setFileName] = useState('No file selected');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFileChange = e => {
        setInvoice(e.target.files[0]);
        setFileName(e.target.files[0] ? e.target.files[0].name : 'No file selected');
    };
    
    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        data.append('customerName', customerName);
        data.append('orderAmount', orderAmount);
        data.append('invoice', invoice);

        try {
            await api.post('/orders', data);
            toast.success('Order created successfully!');
            navigate('/');
        } catch (err) {
            toast.error('Failed to create order.');
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: { xs: 2, sm: 4 }, maxWidth: 600, margin: 'auto' }}>
            <Typography variant="h4" gutterBottom>Create New Order</Typography>
            <Box component="form" onSubmit={onSubmit}>
                <TextField margin="normal" required fullWidth label="Customer Name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                <TextField margin="normal" required fullWidth label="Order Amount ($)" type="number" value={orderAmount} onChange={e => setOrderAmount(e.target.value)} />
                <Button variant="outlined" component="label" fullWidth startIcon={<UploadFileIcon />} sx={{ mt: 2, mb: 1 }}>
                    Upload Invoice (PDF)
                    <input type="file" hidden accept="application/pdf" onChange={onFileChange} />
                </Button>
                <Typography variant="body2" color="text.secondary">{fileName}</Typography>
                <LoadingButton type="submit" fullWidth variant="contained" sx={{ mt: 2 }} loading={loading}>
                    Submit Order
                </LoadingButton>
            </Box>
        </Paper>
    );
};

export default CreateOrder;