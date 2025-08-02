import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if screen is small

    const token = localStorage.getItem('token');
    let userRole = null;

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

                {isMobile ? (
                    // --- Mobile View: Show only icons ---
                    <>
                        <IconButton color="inherit" component={Link} to="/products" title="Products">
                            <StorefrontIcon />
                        </IconButton>
                        {userRole === 'admin' && (
                            <IconButton color="inherit" component={Link} to="/admin/products" title="Manage Products">
                                <AdminPanelSettingsIcon />
                            </IconButton>
                        )}
                        {token ? (
                            <IconButton color="inherit" onClick={handleLogout} title="Logout">
                                <LogoutIcon />
                            </IconButton>
                        ) : (
                            <>
                                <IconButton color="inherit" component={Link} to="/login" title="Login">
                                    <LoginIcon />
                                </IconButton>
                                <IconButton color="inherit" component={Link} to="/signup" title="Sign Up">
                                    <PersonAddIcon />
                                </IconButton>
                            </>
                        )}
                    </>
                ) : (
                    // --- Desktop View: Show full buttons ---
                    <>
                        <Button color="inherit" component={Link} to="/products">Products</Button>
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
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;