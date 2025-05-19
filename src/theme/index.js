import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
  },
  palette: {
    primary: { main: '#00D4FF' },
    secondary: { main: '#B266FF' },
    error: { main: '#FF6A88' },
    background: { default: '#fafbfc' },
  },
});

export default theme; 