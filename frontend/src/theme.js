import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f', // The Hindu's red color
      light: '#ef5350',
      dark: '#b71c1c',
    },
    secondary: {
      main: '#1a1a1a',
    },
    background: {
      default: '#f9f9f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Didot", "GFS Didot", "Roboto", "Arial", sans-serif',
    h1: {
      fontFamily: '"Didot", "GFS Didot", "Georgia", "Times New Roman", serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Didot", "GFS Didot", "Georgia", "Times New Roman", serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Didot", "GFS Didot", "Georgia", "Times New Roman", serif',
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: 'none',
          border: '1px solid #e0e0e0',
        },
      },
    },
  },
});

export default theme;