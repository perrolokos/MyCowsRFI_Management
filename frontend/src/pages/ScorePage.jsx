import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container, Typography, Paper, Box, Grid, TextField, Button,
    CircularProgress, Accordion, AccordionSummary, AccordionDetails, Divider, Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { fetchScoreTemplate, submitScores } from '../features/scoring/scoringSlice';

export const ScorePage = () => {
    const { animalId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Obtenemos los datos del animal pasados desde la página anterior
    const animal = location.state?.animal;

    const { template, isLoading, error } = useSelector((state) => state.scoring);
    const [scores, setScores] = useState({});

    useEffect(() => {
        if (animal?.raza) {
            dispatch(fetchScoreTemplate(animal.raza));
        }
    }, [dispatch, animal]);

    const handleScoreChange = (characteristicId, value) => {
        const score = value === '' ? '' : parseFloat(value);
        setScores(prevScores => ({
            ...prevScores,
            [characteristicId]: score,
        }));
    };

    const finalScore = useMemo(() => {
        if (!template.categories?.length) return 0;

        let totalScore = 0;
        template.categories.forEach(category => {
            const categoryChars = template.characteristics.filter(c => c.categoria === category.id);
            const categoryScoreSum = categoryChars.reduce((sum, char) => {
                return sum + (scores[char.id] || 0);
            }, 0);

            totalScore += categoryScoreSum * (category.ponderacion / 100);
        });
        return totalScore.toFixed(2);
    }, [scores, template]);

    const handleSubmit = () => {
        const scoresToSubmit = Object.entries(scores)
            .filter(([, value]) => value !== '' && !isNaN(value))
            .map(([characteristicId, score]) => ({
                caracteristica: parseInt(characteristicId),
                puntuacion_obtenida: score
            }));

        if (scoresToSubmit.length > 0) {
            dispatch(submitScores({ animalId, scores: scoresToSubmit }))
                .unwrap()
                .then(() => navigate('/animals'));
        }
    };

    if (!animal) {
        return (
            <Container>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="error">Error: No se ha especificado un ejemplar.</Typography>
                    <Button onClick={() => navigate('/animals')} sx={{ mt: 2 }}>Volver a la lista</Button>
                </Paper>
            </Container>
        );
    }
    
    if (isLoading && !template.categories.length) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>{error}</Typography>;
    }

    return (
        <Container maxWidth="lg">
            <Paper sx={{ p: 4, mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <div>
                        <Typography variant="h4">Calificación de Ejemplar</Typography>
                        <Typography variant="h6" color="text.secondary">{animal.nombre} ({animal.identificador})</Typography>
                    </div>
                    <Chip label={`Score Final: ${finalScore}`} color="primary" sx={{ fontSize: '1.2rem', py: 2, px: 1 }} />
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        {template.categories.map(category => (
                            <Accordion key={category.id} defaultExpanded>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">{category.nombre} ({category.ponderacion}%)</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={2}>
                                        {template.characteristics
                                            .filter(c => c.categoria === category.id)
                                            .map(char => (
                                                <Grid item xs={12} sm={6} md={4} key={char.id}>
                                                    <TextField
                                                        fullWidth
                                                        type="number"
                                                        label={char.nombre}
                                                        value={scores[char.id] || ''}
                                                        onChange={(e) => handleScoreChange(char.id, e.target.value)}
                                                        helperText={`Rango aceptado: ${char.rango_aceptado_min} - ${char.rango_aceptado_max} (Ideal: ${char.puntaje_ideal})`}
                                                        inputProps={{
                                                            min: char.rango_aceptado_min,
                                                            max: char.rango_aceptado_max,
                                                            step: "0.1"
                                                        }}
                                                    />
                                                </Grid>
                                            ))}
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" size="large" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} /> : 'Guardar Calificación'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};