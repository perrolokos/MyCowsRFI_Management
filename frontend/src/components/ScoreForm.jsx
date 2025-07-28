
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { submitScores, resetScoreState } from '../redux/scoring/scoreSlice';

export const ScoreForm = ({ animal, scoreTemplate, onClose }) => {
    const dispatch = useDispatch();
    const { isLoading, error, success } = useSelector((state) => state.scores);

    const [scores, setScores] = useState({});

    useEffect(() => {
        // Initialize scores based on the template characteristics
        const initialScores = {};
        scoreTemplate.categorias.forEach(category => {
            category.caracteristicas.forEach(characteristic => {
                initialScores[characteristic.id] = '';
            });
        });
        setScores(initialScores);
    }, [scoreTemplate]);

    useEffect(() => {
        if (success) {
            alert('Calificación guardada exitosamente!');
            dispatch(resetScoreState());
            onClose();
        }
    }, [success, dispatch, onClose]);

    const handleChange = (characteristicId, value) => {
        setScores(prevScores => ({
            ...prevScores,
            [characteristicId]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const scoresToSubmit = [];
        scoreTemplate.categorias.forEach(category => {
            category.caracteristicas.forEach(characteristic => {
                scoresToSubmit.push({
                    ejemplar: animal.id,
                    caracteristica: characteristic.id,
                    puntuacion_obtenida: parseFloat(scores[characteristic.id]),
                });
            });
        });
        dispatch(submitScores(scoresToSubmit));
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                Calificando a: {animal.nombre} ({animal.identificador})
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Plantilla: {scoreTemplate.nombre}
            </Typography>

            {scoreTemplate.categorias.map(category => (
                <Box key={category.id} sx={{ mb: 3, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {category.nombre} (Ponderación: {category.ponderacion}%)
                    </Typography>
                    {category.caracteristicas.map(characteristic => (
                        <TextField
                            key={characteristic.id}
                            margin="normal"
                            required
                            fullWidth
                            label={`${characteristic.nombre} (Ideal: ${characteristic.puntaje_ideal}, Rango: ${characteristic.rango_aceptado_min}-${characteristic.rango_aceptado_max})`}
                            name={`characteristic-${characteristic.id}`}
                            type="number"
                            value={scores[characteristic.id]}
                            onChange={(e) => handleChange(characteristic.id, e.target.value)}
                            inputProps={{ step: "0.1" }}
                        />
                    ))}
                </Box>
            ))}

            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
            >
                {isLoading ? <CircularProgress size={24} /> : 'Guardar Calificación'}
            </Button>
            <Button
                fullWidth
                variant="outlined"
                onClick={onClose}
            >
                Cancelar
            </Button>
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error.detail || 'Error al guardar la calificación.'}
                </Alert>
            )}
        </Box>
    );
};
