import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import { getMockDashboardData } from './mockDashboardData';

export const fetchDashboardData = createAsyncThunk(
    'dashboard/fetchData',
    async (_, { rejectWithValue }) => {
        try {
            // Intenta obtener los datos del backend real
            const { data } = await api.get('/dashboard/scores/');
            return data;
        } catch (error) {
            // Si falla, usa los datos simulados
            try {
                const mockData = await getMockDashboardData();
                return mockData;
            } catch (mockError) {
                return rejectWithValue("Error al cargar datos simulados del dashboard.");
            }
        }
    }
);

const initialState = {
    averageScoresByBreed: [],
    recentScores: [],
    isLoading: false,
    error: null,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.averageScoresByBreed = action.payload.averageScoresByBreed;
                state.recentScores = action.payload.recentScores;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export default dashboardSlice.reducer;