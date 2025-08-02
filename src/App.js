import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Container, CssBaseline, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode'; // <-- You will need to install this

import Header from './components/layout/Header';
import Dashboard from './components/Dashboard';
import CreateOrder from './components/CreateOrder';
import Login from './components/Login';
import Signup from './components/Signup';
import ProductsPage from './components/ProductsPage'; // <-- New import
import AdminProductsPage from './components/AdminProductsPage'; // <-- New import
import { setAuthToken } from './services/api';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (token) {
        setAuthToken(token);
        return children;
    }
    return <Navigate to="/login" />;
};

// New component to protect admin-only routes
const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const decodedToken = jwtDecode(token);
        // This assumes your JWT payload has a 'role' field
        if (decodedToken.role === 'admin') {
            return children;
        }
    } catch (error) {
        // If token is invalid, redirect to login
        return <Navigate to="/login" />;
    }
    
    // If user is not an admin, redirect them to the homepage
    return <Navigate to="/" />;
};


function App() {
  return (
    <Router>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Public Routes */}
            <Route path="/products" element={<ProductsPage />} />

            {/* Protected Routes */}
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/create" element={<PrivateRoute><CreateOrder /></PrivateRoute>} />
            
            {/* Admin-Only Route */}
            <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
          </Routes>
        </Container>
      </Box>
      <ToastContainer position="bottom-right" theme="colored" />
    </Router>
  );
}

export default App;
