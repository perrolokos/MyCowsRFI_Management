import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showNotification } from '../notification/notificationSlice';

const API_URL = process.env.REACT_APP_API_URL;

// Helper function to get auth token
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? `Bearer ${user.access}` : null;
};

// Async thunk for fetching score templates
export const fetchScoreTemplates = createAsyncThunk(
    'scoreTemplates/fetchScoreTemplates',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const token = getAuthToken();
            const response = await axios.get(API_URL + 'score-templates/', {
                headers: {
                    Authorization: token,
                },
            });
            return response.data;
        } catch (error) {
            const message = error.response && error.response.data && error.response.data.detail
                ? error.response.data.detail
                : error.message;
            dispatch(showNotification({ message: `Error al cargar plantillas de calificación: ${message}`, severity: 'error' }));
            return rejectWithValue(message);
        }
    }
);

const scoreTemplateSlice = createSlice({
    name: 'scoreTemplates',
    initialState: {
        templates: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchScoreTemplates.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchScoreTemplates.fulfilled, (state, action) => {
                state.isLoading = false;
                state.templates = action.payload;
            })
            .addCase(fetchScoreTemplates.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default scoreTemplateSlice.reducer;