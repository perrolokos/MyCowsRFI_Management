import { createTheme } from '@mui/material/styles';

export const AppTheme = createTheme({
    palette: {
        primary: {
            main: '#4CAF50', // Un verde agradable
        },
        secondary: {
            main: '#FFC107', // Un amarillo/ámbar
        },
        error: {
            main: '#F44336',
        },
        background: {
            default: '#f4f6f8',
            paper: '#FFFFFF',
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
        h4: {
            fontWeight: 600,
            fontSize: '1.8rem',
        },
        h5: {
            fontWeight: 500,
            fontSize: '1.5rem',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
    },
});