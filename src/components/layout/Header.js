import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // You need this to read the user's role

const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    let userRole = null;

    // If a token exists, decode it to get the user's role
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            userRole = decodedToken.role;
        } catch (error) {
            console.error("Invalid token:", error);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
        window.location.reload();
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                    Order Management
                </Typography>

                {/* Always show the Products link */}
                <Button color="inherit" component={Link} to="/products">Products</Button>

                {/* Only show "Manage Products" if the user is an admin */}
                {userRole === 'admin' && (
                    <Button color="inherit" component={Link} to="/admin/products">
                        Manage Products
                    </Button>
                )}

                {token ? (
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                ) : (
                    <Box>
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                        <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
