import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Container, CssBaseline, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/layout/Header';
import Dashboard from './components/Dashboard';
import CreateOrder from './components/CreateOrder';
import Login from './components/Login';
import Signup from './components/Signup';
import { setAuthToken } from './services/api';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (token) {
        setAuthToken(token);
        return children;
    }
    return <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/create" element={<PrivateRoute><CreateOrder /></PrivateRoute>} />
          </Routes>
        </Container>
      </Box>
      <ToastContainer position="bottom-right" theme="colored" />
    </Router>
  );
}

export default App;