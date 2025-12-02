import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f9fafb',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
    },
    primary: {
      main: '#2563EB'
    },
    secondary: {
      main: '#F59E0B'
    },
    error: {
      main: '#EF4444'
    },
    success: {
      main: '#22C55E'
    }
  },
  shape: {
    borderRadius: 10
  },
  components: {
    MuiPaper: {
      styleOverrides: { root: { borderRadius: 12 } }
    }
  }
});

export default theme;
