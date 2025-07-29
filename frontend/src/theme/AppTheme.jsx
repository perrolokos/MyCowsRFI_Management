import { createTheme } from '@mui/material/styles';

export const AppTheme = createTheme({
    palette: {
        primary: {
            main: '#4CAF50', // Verde Ganadero
        },
        secondary: {
            main: '#795548', // Marrón Tierra
        },
        error: {
            main: '#D32F2F',
        },
        background: {
            default: '#f5f5f5', // Un gris muy claro
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: 'Roboto, "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    border: 'none',
                },
                columnHeaders: {
                    backgroundColor: '#f5f5f5',
                    fontWeight: 'bold',
                },
            },
        },
    },
});