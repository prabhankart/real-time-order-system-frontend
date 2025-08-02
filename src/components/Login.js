import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api, { setAuthToken } from '../services/api';
import { toast } from 'react-toastify';
import { Box, TextField, Paper, Typography, Link } from '@mui/material';
import { LoadingButton } from '@mui/lab';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setAuthToken(res.data.token);
            toast.success('Login successful!');
            navigate('/');
            window.location.reload();
        } catch (err) {
            toast.error('Invalid credentials.');
            setLoading(false);
        }
    };

    return (
       <Paper sx={{ p: { xs: 2, sm: 4 }, maxWidth: 600, margin: 'auto' }}>
            <Typography variant="h4" gutterBottom>Sign In</Typography>
            <Box component="form" onSubmit={onSubmit}>
                <TextField margin="normal" required fullWidth label="Email Address" name="email" value={email} onChange={onChange} />
                <TextField margin="normal" required fullWidth label="Password" name="password" type="password" value={password} onChange={onChange} />
                <LoadingButton type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} loading={loading}>
                    Sign In
                </LoadingButton>
                <Link component={RouterLink} to="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                </Link>
            </Box>
        </Paper>
    );
};

export default Login;