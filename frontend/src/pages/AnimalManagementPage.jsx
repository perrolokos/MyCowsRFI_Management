import React, { useEffect, useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Container,
    Alert,
    Button,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    CircularProgress,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnimals, deleteAnimal } from '../redux/animals/animalSlice';
import { fetchBreeds } from '../redux/breeds/breedSlice';
import { AnimalForm } from '../components/AnimalForm';

export const AnimalManagementPage = () => {
    const dispatch = useDispatch();
    const { items: animals, isLoading, error } = useSelector((state) => state.animals);
    const { items: breeds, isLoading: breedsLoading, error: breedsError } = useSelector((state) => state.breeds); // eslint-disable-line no-unused-vars

    const [openForm, setOpenForm] = useState(false);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

    useEffect(() => {
        dispatch(fetchAnimals());
        dispatch(fetchBreeds());
    }, [dispatch]);

    const breedsMap = useMemo(() => {
        console.log('Breeds loaded:', breeds); // Agregar este log
        return breeds.reduce((acc, breed) => {
            acc[breed.id] = breed.nombre;
            return acc;
        }, {});
    }, [breeds]);

    const handleOpenForm = (animal = null) => {
        setSelectedAnimal(animal);
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
        setSelectedAnimal(null);
        dispatch(fetchAnimals()); // Refresh animals after form submission
    };

    const handleDeleteClick = (id) => {
        setDeleteConfirm({ open: true, id });
    };

    const handleDeleteConfirm = () => {
        if (deleteConfirm.id) {
            dispatch(deleteAnimal(deleteConfirm.id));
        }
        setDeleteConfirm({ open: false, id: null });
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm({ open: false, id: null });
    };

    const filteredAnimals = useMemo(() => {
        const baseAnimals = searchQuery
            ? animals.filter(animal =>
                animal.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                animal.identificador.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : animals;

        // Ensure all items in the array are valid objects with an 'id' property
        return baseAnimals.filter(animal => animal && typeof animal === 'object' && 'id' in animal);
    }, [animals, searchQuery]);

    const columns = [
        { field: 'identificador', headerName: 'Identificador', flex: 1 },
        { field: 'nombre', headerName: 'Nombre', flex: 1 },
{
            field: 'raza',
            headerName: 'Raza',
            flex: 1,
            valueGetter: (params) => {
                // PRIMERO, verifica si params.row existe.
                // Si no existe, no se puede continuar y se evita el error.
                if (!params.row) {
                    return 'Desconocida'; // o devuelve un string vacío: ''
                }

                // Si la verificación pasa, el resto del código se ejecuta de forma segura.
                if (typeof params.row.raza === 'number' || typeof params.row.raza === 'string') {
                    return breedsMap[params.row.raza] || 'Desconocida';
                }
                
                if (typeof params.row.raza === 'object' && params.row.raza) {
                    return params.row.raza.nombre || 'Desconocida';
                }
                
                return 'Desconocida';
            },
        },
        { field: 'fecha_nacimiento', headerName: 'Fecha de Nacimiento', flex: 1 },
        { field: 'peso_actual', headerName: 'Peso (kg)', type: 'number', flex: 0.5 },
        { field: 'talla_actual', headerName: 'Talla (cm)', type: 'number', flex: 0.5 },
        {
            field: 'foto',
            headerName: 'Foto',
            flex: 0.5,
            renderCell: (params) => {
                if (params.value) {
                    return <img src={params.value} alt="Ejemplar" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} />;
                }
                return <Typography variant="caption">Sin foto</Typography>;
            },
            sortable: false,
            filterable: false,
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            align: 'right',
            headerAlign: 'right',
            sortable: false,
            filterable: false,
            flex: 1,
            renderCell: (params) => (
                <Box>
                    <IconButton onClick={() => handleOpenForm(params.row)} color="primary">
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(params.row.id)} color="error">
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Container component="main" sx={{ flexGrow: 1, mt: 4, mb: 2 }}>
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Gestión de Ejemplares
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Button variant="contained" color="primary" onClick={() => handleOpenForm()}>
                            Añadir Nuevo Ejemplar
                        </Button>
                        <TextField
                            label="Buscar por Nombre o ID"
                            variant="outlined"
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error.message}</Alert>}

                    <Box sx={{ height: 600, width: '100%' }}>
                        {(isLoading || breedsLoading) ?  (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <DataGrid
                                rows={filteredAnimals}
                                columns={columns}
                                pageSizeOptions={[10, 25, 50]}
                                initialState={{
                                    pagination: {
                                        paginationModel: { pageSize: 10 },
                                    },
                                }}
                                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                sx={{
                                    '& .MuiDataGrid-root': {
                                        border: 'none',
                                    },
                                    '& .MuiDataGrid-cell': {
                                        borderBottom: '1px solid #e0e0e0',
                                    },
                                    '& .MuiDataGrid-columnHeaders': {
                                        backgroundColor: 'primary.main',
                                        color: 'primary.contrastText',
                                        borderBottom: 'none',
                                    },
                                }}
                            />
                        )}
                    </Box>
                </Paper>
            </Container>
            <Footer />

            {/* Diálogo para Añadir/Editar Ejemplar */}
            <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
                <DialogTitle>{selectedAnimal ? 'Editar Ejemplar' : 'Añadir Nuevo Ejemplar'}</DialogTitle>
                <DialogContent>
                    <AnimalForm animal={selectedAnimal} onClose={handleCloseForm} />
                </DialogContent>
            </Dialog>

            {/* Diálogo de Confirmación para Eliminar */}
            <Dialog
                open={deleteConfirm.open}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>¿Estás seguro de que quieres eliminar este ejemplar? Esta acción no se puede deshacer.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancelar</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AnimalManagementPage;
