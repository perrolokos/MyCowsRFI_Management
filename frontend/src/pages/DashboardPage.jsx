import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container, Typography, Paper, Grid, Box, CircularProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { fetchDashboardData } from '../features/dashboard/dashboardSlice';

// Datos simulados para el gráfico de sensores
const sensorData = [
    { time: '08:00', temperatura: 38.5, actividad: 200 },
    { time: '10:00', temperatura: 38.7, actividad: 500 },
    { time: '12:00', temperatura: 39.0, actividad: 450 },
    { time: '14:00', temperatura: 39.1, actividad: 800 },
    { time: '16:00', temperatura: 38.8, actividad: 600 },
    { time: '18:00', temperatura: 38.6, actividad: 300 },
];

export const DashboardPage = () => {
    const dispatch = useDispatch();
    const { averageScoresByBreed, recentScores, isLoading, error } = useSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(fetchDashboardData());
    }, [dispatch]);

    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>{error}</Typography>;
    }

    return (
        <Container maxWidth="xl"> {/* Cambiado a xl para más espacio */}
            <Typography variant="h4" component="h1" gutterBottom>Dashboard Principal</Typography>
            <Grid container spacing={3}>
                {/* Gráfico de Scores Promedio */}
                <Grid item xs={12} md={6} lg={5}>
                    <Paper sx={{ p: 3, height: '400px' }}>
                        <Typography variant="h6" gutterBottom>Score Promedio por Raza</Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={averageScoresByBreed} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="breedName" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="averageScore" fill="#4CAF50" name="Score Promedio" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                
                {/* Tabla de Calificaciones Recientes */}
                <Grid item xs={12} md={6} lg={7}>
                    <Paper sx={{ p: 3, height: '400px' }}>
                        <Typography variant="h6" gutterBottom>Calificaciones Recientes</Typography>
                        <TableContainer sx={{ maxHeight: 320 }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Ejemplar (ID)</TableCell>
                                        <TableCell align="right">Score</TableCell>
                                        <TableCell align="right">Fecha</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recentScores.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{`${row.animalName} (${row.animalIdentifier})`}</TableCell>
                                            <TableCell align="right">{row.score.toFixed(1)}</TableCell>
                                            <TableCell align="right">{row.date}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                {/* Gráfico de Datos de Sensor */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, height: '400px' }}>
                        <Typography variant="h6" gutterBottom>Monitor de Sensores (Ejemplar: Bessy)</Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <LineChart data={sensorData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="temperatura" stroke="#d32f2f" name="Temperatura (°C)" />
                                <Line yAxisId="right" type="monotone" dataKey="actividad" stroke="#1976d2" name="Actividad (Pasos)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};