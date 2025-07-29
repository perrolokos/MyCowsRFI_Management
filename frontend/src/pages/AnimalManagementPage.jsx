import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Container, Button, Paper, IconButton,
    Dialog, DialogTitle, DialogContent, TextField, DialogActions,
    Chip, Tooltip, InputAdornment
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import { Add, Delete, Edit, Refresh, Search, Assessment as ScoreIcon } from '@mui/icons-material';

import { fetchAnimals, deleteAnimal } from '../features/animals/animalSlice';
import { fetchBreeds } from '../features/breeds/breedSlice';
import { AnimalForm } from '../components/AnimalForm';

// --- CORRECCIÓN AQUÍ ---
// Se vuelve a añadir la constante que faltaba
const SEARCH_DEBOUNCE_DELAY = 300;

export const AnimalManagementPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: animals, isLoading: animalsLoading } = useSelector((state) => state.animals);
    const { items: breeds, isLoading: breedsLoading } = useSelector((state) => state.breeds);

    const [openForm, setOpenForm] = useState(false);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null, name: '' });

    useEffect(() => {
        dispatch(fetchAnimals());
        if (breeds.length === 0) {
            dispatch(fetchBreeds());
        }
    }, [dispatch, breeds.length]);
    
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), SEARCH_DEBOUNCE_DELAY);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const breedsMap = useMemo(() => 
        breeds.reduce((acc, breed) => {
            acc[breed.id] = breed.nombre;
            return acc;
        }, {}), [breeds]);

    const filteredAnimals = useMemo(() => {
        const animalsWithScores = animals.map(animal => ({
            ...animal,
            last_score: Math.random() > 0.3 ? (80 + Math.random() * 15).toFixed(1) : null,
        }));

        if (!debouncedQuery) return animalsWithScores;

        const lowerCaseQuery = debouncedQuery.toLowerCase();
        return animalsWithScores.filter(animal =>
            animal.nombre?.toLowerCase().includes(lowerCaseQuery) ||
            animal.identificador?.toLowerCase().includes(lowerCaseQuery) ||
            breedsMap[animal.raza]?.toLowerCase().includes(lowerCaseQuery)
        );
    }, [animals, debouncedQuery, breedsMap]);
    
    const handleOpenForm = useCallback((animal = null) => {
        setSelectedAnimal(animal);
        setOpenForm(true);
    }, []);

    const handleCloseForm = useCallback(() => {
        setOpenForm(false);
        setSelectedAnimal(null);
    }, []);

    const handleDeleteClick = useCallback((id, name) => {
        setDeleteConfirm({ open: true, id, name });
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        if (deleteConfirm.id) {
            await dispatch(deleteAnimal(deleteConfirm.id));
        }
        setDeleteConfirm({ open: false, id: null, name: '' });
    }, [deleteConfirm.id, dispatch]);

    const handleRefresh = useCallback(() => {
        dispatch(fetchAnimals());
        dispatch(fetchBreeds());
    }, [dispatch]);
    
    const handleScoreClick = useCallback((animal) => {
        navigate(`/animals/${animal.id}/score`, { state: { animal } });
    }, [navigate]);

    const columns = useMemo(() => [
        { field: 'identificador', headerName: 'Identificador', flex: 1, minWidth: 120 },
        { field: 'nombre', headerName: 'Nombre', flex: 1.5, minWidth: 150 },
        {
            field: 'raza',
            headerName: 'Raza',
            flex: 1,
            minWidth: 120,
            renderCell: ({ value }) => <Chip label={breedsMap[value] || 'Desconocida'} size="small" />,
        },
        { 
            field: 'last_score', 
            headerName: 'Último Score', 
            type: 'number', 
            flex: 0.8, 
            minWidth: 100,
            align: 'center',
            headerAlign: 'center',
            renderCell: ({ value }) => value ? 
                <Chip label={value} color={value > 85 ? "success" : "warning"} variant="outlined" size="small" /> : 
                <Chip label="N/A" size="small" />
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            sortable: false,
            filterable: false,
            minWidth: 150,
            align: 'center',
            headerAlign: 'center',
            renderCell: ({ row }) => (
                <Box>
                    <Tooltip title="Calificar / Ver Score"><IconButton onClick={() => handleScoreClick(row)} color="secondary"><ScoreIcon /></IconButton></Tooltip>
                    <Tooltip title="Editar"><IconButton onClick={() => handleOpenForm(row)} color="primary"><Edit /></IconButton></Tooltip>
                    <Tooltip title="Eliminar"><IconButton onClick={() => handleDeleteClick(row.id, row.nombre)} color="error"><Delete /></IconButton></Tooltip>
                </Box>
            ),
        },
    ], [breedsMap, handleOpenForm, handleDeleteClick, handleScoreClick]);

    const isLoading = animalsLoading || breedsLoading;

    return (
        <Container maxWidth="xl">
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" component="h1">Gestión de Ejemplares</Typography>
                    <Chip label={`${filteredAnimals.length} encontrados`} color="info" variant="outlined" />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenForm()}>Añadir Ejemplar</Button>
                        <Button variant="outlined" startIcon={<Refresh />} onClick={handleRefresh}>Actualizar</Button>
                    </Box>
                    <TextField
                        label="Buscar..."
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                        }}
                    />
                </Box>

                <Box sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        rows={filteredAnimals}
                        columns={columns}
                        loading={isLoading}
                        pageSizeOptions={[10, 25, 50]}
                        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                        disableRowSelectionOnClick
                    />
                </Box>
            </Paper>

            <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
                <DialogTitle>{selectedAnimal ? 'Editar Ejemplar' : 'Añadir Nuevo Ejemplar'}</DialogTitle>
                <DialogContent><AnimalForm animal={selectedAnimal} onClose={handleCloseForm} /></DialogContent>
            </Dialog>

            <Dialog open={deleteConfirm.open} onClose={() => setDeleteConfirm({ ...deleteConfirm, open: false })}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Estás seguro de que quieres eliminar a <strong>"{deleteConfirm.name}"</strong>? Esta acción es irreversible.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirm({ ...deleteConfirm, open: false })}>Cancelar</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">Eliminar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};