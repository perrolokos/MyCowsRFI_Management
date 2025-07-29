import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { AppRouter } from './router/AppRouter';
import { AppTheme } from './theme/AppTheme';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import NotificationSnackbar from './components/NotificationSnackbar';

function App() {
    return (
        <ThemeProvider theme={AppTheme}>
            <CssBaseline />
            <BrowserRouter>
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Navbar />
                    <Box component="main" sx={{ flexGrow: 1, pt: 4, pb: 4 }}>
                        <AppRouter />
                    </Box>
                    <Footer />
                    <NotificationSnackbar />
                </Box>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;