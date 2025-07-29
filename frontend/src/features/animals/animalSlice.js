import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import { showNotification } from '../notification/notificationSlice';

// Thunks para operaciones CRUD de Animales
export const fetchAnimals = createAsyncThunk('animals/fetchAnimals', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/animals/');
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.detail || 'Error al cargar ejemplares.');
    }
});

export const addAnimal = createAsyncThunk('animals/addAnimal', async (animalData, { dispatch, rejectWithValue }) => {
    try {
        const { data } = await api.post('/animals/', animalData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        dispatch(showNotification({ message: 'Ejemplar añadido con éxito', severity: 'success' }));
        return data;
    } catch (error) {
        const message = error.response?.data?.detail || 'Ocurrió un error al añadir el ejemplar.';
        dispatch(showNotification({ message, severity: 'error' }));
        return rejectWithValue(message);
    }
});

export const updateAnimal = createAsyncThunk('animals/updateAnimal', async ({ id, animalData }, { dispatch, rejectWithValue }) => {
    try {
        const { data } = await api.put(`/animals/${id}/`, animalData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        dispatch(showNotification({ message: 'Ejemplar actualizado con éxito', severity: 'success' }));
        return data;
    } catch (error) {
        const message = error.response?.data?.detail || 'Ocurrió un error al actualizar.';
        dispatch(showNotification({ message, severity: 'error' }));
        return rejectWithValue(message);
    }
});

export const deleteAnimal = createAsyncThunk('animals/deleteAnimal', async (id, { dispatch, rejectWithValue }) => {
    try {
        await api.delete(`/animals/${id}/`);
        dispatch(showNotification({ message: 'Ejemplar eliminado con éxito', severity: 'success' }));
        return id;
    } catch (error) {
        const message = error.response?.data?.detail || 'Error al eliminar el ejemplar.';
        dispatch(showNotification({ message, severity: 'error' }));
        return rejectWithValue(message);
    }
});


const animalSlice = createSlice({
    name: 'animals',
    initialState: {
        items: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnimals.pending, (state) => { state.isLoading = true; })
            .addCase(fetchAnimals.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchAnimals.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(addAnimal.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateAnimal.fulfilled, (state, action) => {
                const index = state.items.findIndex(animal => animal.id === action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(deleteAnimal.fulfilled, (state, action) => {
                state.items = state.items.filter(animal => animal.id !== action.payload);
            });
    },
});

export default animalSlice.reducer;