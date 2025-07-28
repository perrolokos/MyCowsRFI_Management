import React from 'react';
import { Box, Typography, Container } from '@mui/material';

export const HomePage = () => {
    return (
        <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Bienvenido a MyCows RFI
                </Typography>
                <Typography variant="body1">
                    Esta es la aplicación para la gestión de ejemplares bovinos y su calificación.
                </Typography>
            </Box>
        </Container>
    );
};