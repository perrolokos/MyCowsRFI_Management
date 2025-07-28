
import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';

export const DashboardPage = () => {
    return (
        <Container component="main" sx={{ mt: 4, mb: 2 }} maxWidth="lg">
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Dashboard
                </Typography>
                <Typography variant="body1">
                    Bienvenido a tu panel de control. Aquí podrás ver un resumen de tus ejemplares y datos importantes.
                </Typography>
                {/* Aquí puedes añadir gráficos, estadísticas, etc. */}
            </Paper>
        </Container>
    );
};
