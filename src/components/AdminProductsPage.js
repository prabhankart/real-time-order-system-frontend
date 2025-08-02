import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import {
    Box, TextField, Paper, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '', price: '', imageUrl: '' });
    const [loading, setLoading] = useState(false);

    // State for the edit modal
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    const fetchProducts = async () => {
        const res = await api.get('/api/products');
        setProducts(res.data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onEditChange = e => setCurrentProduct({ ...currentProduct, [e.target.name]: e.target.value });

    // Handle creating a new product
    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/api/products', formData);
            toast.success('Product added successfully!');
            fetchProducts();
            setFormData({ name: '', description: '', price: '', imageUrl: '' });
        } catch (err) {
            toast.error('Failed to add product.');
        } finally {
            setLoading(false);
        }
    };

    // Handle deleting a product
    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/api/products/${productId}`);
                toast.success('Product deleted successfully!');
                fetchProducts();
            } catch (err) {
                toast.error('Failed to delete product.');
            }
        }
    };

    // Handle opening the edit modal
    const handleEditOpen = (product) => {
        setCurrentProduct(product);
        setEditModalOpen(true);
    };

    const handleEditClose = () => {
        setEditModalOpen(false);
        setCurrentProduct(null);
    };

    // Handle submitting the updated product
    const handleEditSubmit = async () => {
        try {
            await api.put(`/api/products/${currentProduct._id}`, currentProduct);
            toast.success('Product updated successfully!');
            fetchProducts();
            handleEditClose();
        } catch (err) {
            toast.error('Failed to update product.');
        }
    };

    return (
        <Box>
            {/* --- Add Product Form --- */}
            <Paper sx={{ p: 4, mb: 4 }}>
                <Typography variant="h5" gutterBottom>Add New Product</Typography>
                <Box component="form" onSubmit={onSubmit}>
                    {/* ... TextFields for the form ... */}
                    <LoadingButton type="submit" fullWidth variant="contained" sx={{ mt: 2 }} loading={loading}>
                        Add Product
                    </LoadingButton>
                </Box>
            </Paper>

            {/* --- Existing Products Table --- */}
            <Typography variant="h5" gutterBottom>Existing Products</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell align="right">Actions</TableCell> {/* <-- New Column */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product._id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>${product.price.toFixed(2)}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleEditOpen(product)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(product._id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* --- Edit Product Modal --- */}
            <Dialog open={editModalOpen} onClose={handleEditClose}>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogContent>
                    {currentProduct && (
                        <Box component="form" sx={{ mt: 2 }}>
                            <TextField margin="normal" required fullWidth label="Product Name" name="name" value={currentProduct.name} onChange={onEditChange} />
                            <TextField margin="normal" required fullWidth label="Description" name="description" value={currentProduct.description} onChange={onEditChange} />
                            <TextField margin="normal" required fullWidth label="Price ($)" name="price" type="number" value={currentProduct.price} onChange={onEditChange} />
                            <TextField margin="normal" required fullWidth label="Image URL" name="imageUrl" value={currentProduct.imageUrl} onChange={onEditChange} />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose}>Cancel</Button>
                    <Button onClick={handleEditSubmit} variant="contained">Save Changes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminProductsPage;