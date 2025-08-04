import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Fab, 
    Typography, Box, Button, Tooltip, IconButton, Select, MenuItem, Link,
    TextField, FormControl, InputLabel, Grid 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import io from 'socket.io-client'; // <-- Import socket.io-client
// ... other imports

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000'); // <-- Connect to your backend


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const fetchOrders = async () => {
        try {
            const res = await api.get(`/orders?page=${page}&search=${search}&status=${statusFilter}`);
            setOrders(res.data.orders);
            setTotalPages(res.data.totalPages);
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
          // --- ADD THIS REAL-TIME LOGIC ---
        // Listen for the 'new_order' event from the server
        socket.on('new_order', (newOrder) => {
            // Add the new order to the top of the list in real-time
            setOrders(prevOrders => [newOrder, ...prevOrders]);
            toast.info('A new order has been placed!');
        });

        // Clean up the socket connection when the component unmounts
        return () => {
            socket.off('new_order');
        };
    }, [page, search, statusFilter]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            toast.success('Order status updated!');
            fetchOrders();
        } catch (err) {
            toast.error('Failed to update status.');
        }
    };

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
            <Paper sx={{ p: 2, mb: 4 }}>
                <Bar data={chartData} />
            </Paper>
            
            <Typography variant="h4" gutterBottom>
                {userRole === 'admin' ? 'All Orders' : 'My Orders'}
            </Typography>

            {userRole === 'admin' && (
                <Paper sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Search by Customer Name"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={statusFilter}
                                    label="Status"
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <MenuItem value="All">All</MenuItem>
                                    <MenuItem value="Pending">Pending</MenuItem>
                                    <MenuItem value="Processing">Processing</MenuItem>
                                    <MenuItem value="Shipped">Shipped</MenuItem>
                                    <MenuItem value="Delivered">Delivered</MenuItem>
                                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <Button variant="contained" onClick={handleExport} fullWidth>Export</Button>
                        </Grid>
                    </Grid>
                </Paper>
            )}
            
            <Paper sx={{ width: '100%', overflowX: 'auto' }}>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell> {/* <-- THE FIX IS HERE */}
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
                                    <TableCell>
                                        <Link component={RouterLink} to={`/orders/${order._id}`} underline="hover">
                                            {order._id}
                                        </Link>
                                    </TableCell>
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

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>
                    Previous
                </Button>
                <Typography sx={{ mx: 2 }}>
                    Page {page} of {totalPages}
                </Typography>
                <Button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                    Next
                </Button>
            </Box>

            <Fab color="primary" sx={{ position: 'fixed', bottom: 40, right: 40 }} component={RouterLink} to="/create">
                <AddIcon />
            </Fab>
        </Box>
    );
};

export default Dashboard;