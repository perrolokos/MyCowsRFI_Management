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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
} from '@mui/material';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnimals } from '../redux/animals/animalSlice';
import { fetchScoreTemplates } from '../redux/scoring/scoreTemplateSlice';
import { ScoreForm } from '../components/ScoreForm';

export const ScorePage = () => {
    const dispatch = useDispatch();
    const { animals, isLoading: animalsLoading, error: animalsError } = useSelector((state) => state.animals);
    const { templates, isLoading: templatesLoading, error: templatesError } = useSelector((state) => state.scoreTemplates);

    const [selectedAnimalId, setSelectedAnimalId] = useState('');
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [scoreTemplate, setScoreTemplate] = useState(null);
    const [openScoreForm, setOpenScoreForm] = useState(false);

    useEffect(() => {
        dispatch(fetchAnimals());
        dispatch(fetchScoreTemplates());
    }, [dispatch]);

    useEffect(() => {
        if (selectedAnimalId && animals.length > 0) {
            const animal = animals.find(a => a.id === selectedAnimalId);
            setSelectedAnimal(animal);
            if (animal && templates.length > 0) {
                // Assuming 'raza' in animal object is the ID of the breed
                const template = templates.find(t => t.raza === animal.raza);
                setScoreTemplate(template);
            }
        }
    }, [selectedAnimalId, animals, templates]);

    const handleAnimalChange = (event) => {
        setSelectedAnimalId(event.target.value);
        setScoreTemplate(null); // Reset template when animal changes
        setSelectedAnimal(null); // Reset selected animal when animal changes
    };

    const handleOpenScoreForm = () => {
        setOpenScoreForm(true);
    };

    const handleCloseScoreForm = () => {
        setOpenScoreForm(false);
        setSelectedAnimalId(''); // Reset selected animal after form submission
        setSelectedAnimal(null);
        setScoreTemplate(null);
        // Optionally re-fetch animals or scores if needed after submission
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="md">
                <Typography variant="h4" component="h1" gutterBottom>
                    Calificación de Ejemplares
                </Typography>

                {(animalsLoading || templatesLoading) && <CircularProgress />}
                {(animalsError || templatesError) && (
                    <Alert severity="error">Error: {animalsError?.message || templatesError?.message || 'No se pudieron cargar los datos necesarios.'}</Alert>
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

                {selectedAnimal && scoreTemplate && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h5" gutterBottom>
                            Ejemplar Seleccionado: {selectedAnimal.nombre} ({selectedAnimal.identificador})
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            Plantilla de Calificación: {scoreTemplate.nombre}
                        </Typography>
                        <Button variant="contained" color="primary" onClick={handleOpenScoreForm} sx={{ mt: 3 }}>
                            Iniciar Calificación
                        </Button>
                    </Box>
                )}

                {!selectedAnimal && !animalsLoading && !animalsError && animals.length > 0 && (
                    <Typography>Por favor, selecciona un ejemplar para calificar.</Typography>
                )}

                {!animalsLoading && !animalsError && animals.length === 0 && (
                    <Typography>No hay ejemplares disponibles para calificar. Por favor, añade algunos en la sección de Gestión de Ejemplares.</Typography>
                )}
            </Container>
            <Footer />

            <Dialog open={openScoreForm} onClose={handleCloseScoreForm} fullWidth maxWidth="md">
                <DialogTitle>Calificar Ejemplar</DialogTitle>
                <DialogContent>
                    {selectedAnimal && scoreTemplate && (
                        <ScoreForm
                            animal={selectedAnimal}
                            scoreTemplate={scoreTemplate}
                            onClose={handleCloseScoreForm}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};