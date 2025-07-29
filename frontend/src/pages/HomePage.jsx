import React from 'react';
import { Box, Typography, Container, Paper, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const HomePage = () => {
    return (
        <Container component="main" maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
                <Typography variant="h2" component="h1" gutterBottom color="primary">
                    Bienvenido a MyCows RFI
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph>
                    La solución integral para la gestión y calificación de ejemplares bovinos.
                </Typography>
                <Box sx={{ mt: 4 }}>
                    <Button component={RouterLink} to="/login" variant="contained" size="large" sx={{ mx: 1 }}>
                        Iniciar Sesión
                    </Button>
                    <Button component={RouterLink} to="/register" variant="outlined" size="large" sx={{ mx: 1 }}>
                        Registrarse
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};