
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
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
                <Navbar />
                <main style={{ flexGrow: 1, paddingTop: '64px' }}>
                    <AppRouter />
                </main>
                <Footer />
                <NotificationSnackbar />
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
