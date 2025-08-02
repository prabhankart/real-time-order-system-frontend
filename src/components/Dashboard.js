import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Fab, Typography, Box, Button, Tooltip, IconButton, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [userRole, setUserRole] = useState(null);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserRole(decodedToken.role);
        }
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            toast.success('Order status updated!');
            fetchOrders(); // Refresh the list
        } catch (err) {
               toast.error('Failed to update status.');
        }
    };

    // --- LOGIC MOVED INSIDE THE COMPONENT ---
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
    // --- END OF MOVED LOGIC ---

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Sales Analytics</Typography>
            <Paper sx={{ p: 2, mb: 4 }}>
                <Bar data={chartData} />
            </Paper>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">
                    {userRole === 'admin' ? 'All Orders' : 'My Orders'}
                </Typography>
                {userRole === 'admin' && <Button variant="contained" onClick={handleExport}>Export as JSON</Button>}
            </Box>
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Customer</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell align="right">Amount</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Invoice</TableCell>
                                {userRole === 'admin' && <TableCell>Actions</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow hover key={order._id}>
                                    <TableCell>{order.customerName}</TableCell>
                                    <TableCell>{order.customerEmail}</TableCell>
                                    <TableCell align="right">${order.orderAmount.toFixed(2)}</TableCell>
                                    <TableCell>{order.status}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="View Invoice">
                                            <IconButton href={order.invoiceFileUrl} target="_blank" color="primary" rel="noopener noreferrer">
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    {userRole === 'admin' && (
                                        <TableCell>
                                            <Select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                size="small"
                                            >
                                                <MenuItem value="Pending">Pending</MenuItem>
                                                <MenuItem value="Processing">Processing</MenuItem>
                                                <MenuItem value="Shipped">Shipped</MenuItem>
                                                <MenuItem value="Delivered">Delivered</MenuItem>
                                                <MenuItem value="Cancelled">Cancelled</MenuItem>
                                            </Select>
                                        </TableCell>
                                    )}
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