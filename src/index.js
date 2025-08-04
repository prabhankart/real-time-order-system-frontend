import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { CartProvider } from './context/CartContext'; // <-- Import the provider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
     <CartProvider> {/* <-- Wrap your App */}
        <App />
      </CartProvider>
    </ThemeProvider>
  </React.StrictMode>
);