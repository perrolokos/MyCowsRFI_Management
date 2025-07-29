import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

export const fetchBreeds = createAsyncThunk('breeds/fetchBreeds', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/breeds/');
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.detail || 'Error al cargar las razas.');
    }
});

const breedSlice = createSlice({
    name: 'breeds',
    initialState: {
        items: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBreeds.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchBreeds.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchBreeds.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default breedSlice.reducer;