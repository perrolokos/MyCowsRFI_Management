import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import { showNotification } from '../notification/notificationSlice';

export const fetchDashboardData = createAsyncThunk(
    'dashboard/fetchData',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await api.get('/dashboard/scores/');
            return data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            dispatch(showNotification({ message: `Error al cargar datos del dashboard: ${message}`, severity: 'error' }));
            return rejectWithValue(message);
        }
    }
);

export const fetchSensorData = createAsyncThunk(
    'dashboard/fetchSensorData',
    async (animalId, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await api.get(`/animals/${animalId}/sensor-data/`);
            return data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            dispatch(showNotification({ message: `Error al cargar datos del sensor: ${message}`, severity: 'error' }));
            return rejectWithValue(message);
        }
    }
);

const initialState = {
    averageScoresByBreed: [],
    recentScores: [],
    sensorData: [],
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
            })
            .addCase(fetchSensorData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSensorData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.sensorData = action.payload;
            })
            .addCase(fetchSensorData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export default dashboardSlice.reducer;