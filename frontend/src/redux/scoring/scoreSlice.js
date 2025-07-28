import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showNotification } from '../notification/notificationSlice';

const API_URL = process.env.REACT_APP_API_URL;

// Helper function to get auth token
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? `Bearer ${user.access}` : null;
};

// Async thunk for submitting scores
export const submitScores = createAsyncThunk(
    'scores/submitScores',
    async (scoreData, { rejectWithValue, dispatch }) => {
        try {
            const token = getAuthToken();
            // scoreData is expected to be an array of score objects
            // Each score object should contain: ejemplar, caracteristica, puntuacion_obtenida
            const response = await axios.post(API_URL + 'scores/', scoreData, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
            });
            dispatch(showNotification({ message: 'Calificación guardada exitosamente!', severity: 'success' }));
            return response.data;
        } catch (error) {
            const message = error.response && error.response.data && error.response.data.detail
                ? error.response.data.detail
                : error.message;
            dispatch(showNotification({ message: `Error al guardar calificación: ${message}`, severity: 'error' }));
            return rejectWithValue(message);
        }
    }
);

const scoreSlice = createSlice({
    name: 'scores',
    initialState: {
        scores: [],
        isLoading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetScoreState: (state) => {
            state.isLoading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitScores.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(submitScores.fulfilled, (state, action) => {
                state.isLoading = false;
                state.scores = action.payload; // Assuming backend returns the submitted scores
                state.success = true;
            })
            .addCase(submitScores.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export const { resetScoreState } = scoreSlice.actions;
export default scoreSlice.reducer;