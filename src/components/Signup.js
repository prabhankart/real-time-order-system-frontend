import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Box, TextField, Paper, Typography, Link } from '@mui/material';
import { LoadingButton } from '@mui/lab';

const Signup = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { email, password } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/api/auth/register', { email, password });
            toast.success('Registration successful! Please log in.');
            navigate('/login');
        } catch (err) {
            toast.error('Registration failed.');
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 4, maxWidth: 500, margin: 'auto' }}>
            <Typography variant="h4" gutterBottom>Sign Up</Typography>
            <Box component="form" onSubmit={onSubmit}>
                <TextField margin="normal" required fullWidth label="Email Address" name="email" value={email} onChange={onChange} />
                <TextField margin="normal" required fullWidth label="Password" name="password" type="password" value={password} onChange={onChange} />
                <LoadingButton type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} loading={loading}>
                    Sign Up
                </LoadingButton>
                <Link component={RouterLink} to="/login" variant="body2">
                    Already have an account? Sign In
                </Link>
            </Box>
        </Paper>
    );
};

export default Signup;