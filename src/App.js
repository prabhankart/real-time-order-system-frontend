import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Container, CssBaseline, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import CartPage from './components/CartPage'; // <-- Import CartPage
import Header from './components/layout/Header';
import Dashboard from './components/Dashboard';
import CreateOrder from './components/CreateOrder';
import Login from './components/Login';
import Signup from './components/Signup';
import ProductsPage from './components/ProductsPage';
import AdminProductsPage from './components/AdminProductsPage';
import OrderDetail from './components/OrderDetail'; 
import { setAuthToken } from './services/api';
import Footer from './components/layout/Footer'; // <-- Import the new footer

// This block runs when the app first loads to keep the user logged in
const token = localStorage.getItem('token');
if (token) {
    setAuthToken(token);
}

// Component to protect routes for any logged-in user
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

// Component to protect routes for admin users only
const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.role === 'admin') {
            return children;
        }
    } catch (error) {
        console.error("Invalid token:", error);
        return <Navigate to="/login" />;
    }
    
    // If the user is logged in but is not an admin, send them to the homepage
    return <Navigate to="/" />;
};
//hhjhhhjjjgit add 
function App() {
  return (
    <Router>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
          <Routes>
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Public Routes */}
            <Route path="/products" element={<ProductsPage />} />

            {/* Protected Routes (for any logged-in user) */}
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/create" element={<PrivateRoute><CreateOrder /></PrivateRoute>} />
              <Route path="/orders/:id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
               <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} /> {/* <-- Add this route */}
            
            
            {/* Admin-Only Route */}
            <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
          </Routes>
        </Container>
         <Footer /> {/* <-- Replace Copyright with Footer */}
      
      </Box>
      <ToastContainer position="bottom-right" theme="colored" />
    </Router>
  );
}

export default App;