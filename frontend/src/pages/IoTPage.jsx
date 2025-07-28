
import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Container,
    CircularProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    Paper,
} from '@mui/material';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnimals } from '../redux/animals/animalSlice';
import { fetchSensorData, fetchAlerts } from '../redux/iot/iotSlice';

export const IoTPage = () => {
    const dispatch = useDispatch();
    const { animals, isLoading: animalsLoading, error: animalsError } = useSelector((state) => state.animals);
    const { sensorData, alerts, isLoading: iotLoading, error: iotError } = useSelector((state) => state.iot);

    const [selectedAnimalId, setSelectedAnimalId] = useState('');
    const [selectedAnimal, setSelectedAnimal] = useState(null);

    useEffect(() => {
        dispatch(fetchAnimals());
    }, [dispatch]);

    useEffect(() => {
        if (selectedAnimalId) {
            const animal = animals.find(a => a.id === selectedAnimalId);
            setSelectedAnimal(animal);
            dispatch(fetchSensorData(selectedAnimalId));
            dispatch(fetchAlerts(selectedAnimalId));
        } else {
            setSelectedAnimal(null);
        }
    }, [selectedAnimalId, animals, dispatch]);

    const handleAnimalChange = (event) => {
        setSelectedAnimalId(event.target.value);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="lg">
                <Typography variant="h4" component="h1" gutterBottom>
                    Monitoreo IoT y Alertas
                </Typography>

                {(animalsLoading || iotLoading) && <CircularProgress />}
                {(animalsError || iotError) && (
                    <Alert severity="error">Error: {animalsError?.message || iotError?.message || 'No se pudieron cargar los datos necesarios.'}</Alert>
                )}

                {!animalsLoading && !animalsError && animals.length > 0 && (
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel id="animal-select-label">Seleccionar Ejemplar</InputLabel>
                        <Select
                            labelId="animal-select-label"
                            id="animal-select"
                            value={selectedAnimalId}
                            label="Seleccionar Ejemplar"
                            onChange={handleAnimalChange}
                        >
                            {animals.map((animal) => (
                                <MenuItem key={animal.id} value={animal.id}>
                                    {animal.nombre} ({animal.identificador})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                {selectedAnimal && !iotLoading && !iotError && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h5" gutterBottom>
                            Datos de Sensores para {selectedAnimal.nombre} ({selectedAnimal.identificador})
                        </Typography>
                        {sensorData.length > 0 ? (
                            <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                                <List>
                                    {sensorData.map((data, index) => (
                                        <ListItem key={index} divider>
                                            <ListItemText
                                                primary={`Fecha: ${new Date(data.timestamp).toLocaleString()}`}
                                                secondary={`Temperatura: ${data.temperatura}°C, Actividad: ${data.actividad}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        ) : (
                            <Typography>No hay datos de sensores para este ejemplar.</Typography>
                        )}

                        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                            Alertas para {selectedAnimal.nombre} ({selectedAnimal.identificador})
                        </Typography>
                        {alerts.length > 0 ? (
                            <Paper elevation={3} sx={{ p: 2 }}>
                                <List>
                                    {alerts.map((alert, index) => (
                                        <ListItem key={index} divider>
                                            <ListItemText
                                                primary={`Tipo: ${alert.alert_type} - ${new Date(alert.timestamp).toLocaleString()}`}
                                                secondary={alert.message}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        ) : (
                            <Typography>No hay alertas para este ejemplar.</Typography>
                        )}
                    </Box>
                )}

                {!selectedAnimal && !animalsLoading && !animalsError && animals.length > 0 && (
                    <Typography>Por favor, selecciona un ejemplar para ver sus datos IoT y alertas.</Typography>
                )}

                {!animalsLoading && !animalsError && animals.length === 0 && (
                    <Typography>No hay ejemplares disponibles. Por favor, añade algunos en la sección de Gestión de Ejemplares para ver datos IoT.</Typography>
                )}
            </Container>
            <Footer />
        </Box>
    );
};
