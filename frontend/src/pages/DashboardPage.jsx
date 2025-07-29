import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container, Typography, Paper, Grid, Box, CircularProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { fetchDashboardData, fetchSensorData } from '../features/dashboard/dashboardSlice';

// Datos simulados para el gráfico de sensores
export const DashboardPage = () => {
    const dispatch = useDispatch();
    const { averageScoresByBreed, recentScores, sensorData, isLoading, error } = useSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(fetchDashboardData());
        // Hardcoding animal ID 1 for sensor data for now. In a real app, this would be dynamic.
        dispatch(fetchSensorData(1)); 
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
                                        <TableCell>Ejemplar</TableCell>
                                        <TableCell align="right">Score</TableCell>
                                        <TableCell align="right">Fecha</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recentScores.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                                                {row.animalPhotoUrl && (
                                                    <img src={row.animalPhotoUrl} alt={row.animalName} style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 8, objectFit: 'cover' }} />
                                                )}
                                                {`${row.animalName} (${row.animalIdentifier})`}
                                            </TableCell>
                                            <TableCell align="right">{typeof row.score === 'number' ? row.score.toFixed(1) : 'N/A'}</TableCell>
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
                        <Typography variant="h6" gutterBottom>Monitor de Sensores (Ejemplar: 1)</Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <LineChart data={sensorData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" tickFormatter={(tick) => new Date(tick).toLocaleTimeString()} />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
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