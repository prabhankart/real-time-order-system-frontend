import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import api from '../services/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Fab, Typography, Box, Button, Link, Tooltip, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const Dashboard = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders');
                setOrders(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchOrders();
    }, []);

    const handleExport = async () => {
        try {
            const res = await api.get('/orders/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'orders.json');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Failed to export orders', err);
        }
    };
    
    const chartData = {
        labels: orders.map(o => new Date(o.orderDate).toLocaleDateString()),
        datasets: [{
            label: 'Sales Amount ($)',
            data: orders.map(o => o.orderAmount),
            backgroundColor: 'rgba(25, 118, 210, 0.5)',
        }],
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Sales Analytics</Typography>
            <Paper sx={{ p: 2, mb: 4 }}><Bar data={chartData} /></Paper>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">Orders Dashboard</Typography>
                <Button variant="contained" onClick={handleExport}>Export as JSON</Button>
            </Box>
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Customer</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell align="right">Amount</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell align="center">Invoice</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow hover key={order._id}>
                                    <TableCell>{order.customerName}</TableCell>
                                    <TableCell>{order.customerEmail}</TableCell>
                                    <TableCell align="right">${order.orderAmount.toFixed(2)}</TableCell>
                                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="View Invoice">
                                            <IconButton href={order.invoiceFileUrl} target="_blank" color="primary" rel="noopener noreferrer">
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Fab color="primary" sx={{ position: 'fixed', bottom: 40, right: 40 }} component={RouterLink} to="/create">
                <AddIcon />
            </Fab>
        </Box>
    );
};

export default Dashboard;