import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showNotification } from '../notification/notificationSlice';

const API_URL = process.env.REACT_APP_API_URL;

// Helper function to get auth token
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? `Bearer ${user.access}` : null;
};

// Async thunk for fetching sensor data for a specific animal
export const fetchSensorData = createAsyncThunk(
    'iot/fetchSensorData',
    async (animalId, { rejectWithValue, dispatch }) => {
        try {
            const token = getAuthToken();
            const response = await axios.get(API_URL + `animals/${animalId}/sensor-data/`, {
                headers: {
                    Authorization: token,
                },
            });
            return response.data;
        } catch (error) {
            const message = error.response && error.response.data && error.response.data.detail
                ? error.response.data.detail
                : error.message;
            dispatch(showNotification({ message: `Error al cargar datos de sensores: ${message}`, severity: 'error' }));
            return rejectWithValue(message);
        }
    }
);

// Async thunk for fetching alerts for a specific animal
export const fetchAlerts = createAsyncThunk(
    'iot/fetchAlerts',
    async (animalId, { rejectWithValue, dispatch }) => {
        try {
            const token = getAuthToken();
            const response = await axios.get(API_URL + `animals/${animalId}/alerts/`, {
                headers: {
                    Authorization: token,
                },
            });
            return response.data;
        } catch (error) {
            const message = error.response && error.response.data && error.response.data.detail
                ? error.response.data.detail
                : error.message;
            dispatch(showNotification({ message: `Error al cargar alertas: ${message}`, severity: 'error' }));
            return rejectWithValue(message);
        }
    }
);

const iotSlice = createSlice({
    name: 'iot',
    initialState: {
        sensorData: [],
        alerts: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
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
            })
            .addCase(fetchAlerts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAlerts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.alerts = action.payload;
            })
            .addCase(fetchAlerts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default iotSlice.reducer;