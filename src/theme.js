import { createTheme } from '@mui/material/styles';

// Create a custom theme for a premium feel
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // A professional blue
    },
    secondary: {
      main: '#dc004e', // A contrasting pink/red
    },
    background: {
      default: '#f4f6f8',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Softer corners for Paper components
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // More readable buttons
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;