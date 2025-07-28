import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

// Thunk para obtener todos los animales
export const fetchAnimals = createAsyncThunk(
    'animals/fetchAnimals',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/animals/');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Thunk para añadir un nuevo animal
export const addAnimal = createAsyncThunk(
    'animals/addAnimal',
    async (animalData, { rejectWithValue }) => {
        try {
            const response = await api.post('/animals/', animalData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Thunk para actualizar un animal existente
export const updateAnimal = createAsyncThunk(
    'animals/updateAnimal',
    async ({ id, animalData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/animals/${id}/`, animalData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Thunk para eliminar un animal
export const deleteAnimal = createAsyncThunk(
    'animals/deleteAnimal',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/animals/${id}/`);
            return id; // Devolvemos el ID para poder eliminarlo del estado
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const animalSlice = createSlice({
    name: 'animals',
    initialState: {
        items: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchAnimals
            .addCase(fetchAnimals.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAnimals.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchAnimals.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // addAnimal
            .addCase(addAnimal.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addAnimal.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items.push(action.payload);
            })
            .addCase(addAnimal.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // updateAnimal
            .addCase(updateAnimal.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateAnimal.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.items.findIndex(animal => animal.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateAnimal.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // deleteAnimal
            .addCase(deleteAnimal.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteAnimal.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = state.items.filter(animal => animal.id !== action.payload);
            })
            .addCase(deleteAnimal.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = animalSlice.actions;
export default animalSlice.reducer;
