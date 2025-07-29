import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import { showNotification } from '../notification/notificationSlice';


// Thunk para obtener la plantilla de calificación
export const fetchScoreTemplate = createAsyncThunk(
    'scoring/fetchTemplate',
    async (breedId, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await api.get(`/score-templates/breed/${breedId}/`);
            return data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            dispatch(showNotification({ message: `Error al cargar la plantilla de calificación: ${message}`, severity: 'error' }));
            return rejectWithValue(message);
        }
    }
);

// Thunk para guardar las calificaciones de un ejemplar
export const submitScores = createAsyncThunk(
    'scoring/submitScores',
    async ({ animalId, scores }, { dispatch, rejectWithValue }) => {
        try {
            const { data } = await api.post(`/animals/${animalId}/scores/`, { scores });
            dispatch(showNotification({ message: 'Calificación guardada con éxito', severity: 'success' }));
            return data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            dispatch(showNotification({ message: `Error al guardar la calificación: ${message}`, severity: 'error' }));
            return rejectWithValue(message);
        }
    }
);

const initialState = {
    template: {
        categories: [],
        characteristics: [],
    },
    isLoading: false,
    error: null,
};

const scoringSlice = createSlice({
    name: 'scoring',
    initialState,
    reducers: {
        clearTemplate(state) {
            state.template = { categories: [], characteristics: [] };
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchScoreTemplate.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.template = { categories: [], characteristics: [] };
            })
            .addCase(fetchScoreTemplate.fulfilled, (state, action) => {
                state.isLoading = false;
                state.template = action.payload;
            })
            .addCase(fetchScoreTemplate.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(submitScores.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(submitScores.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(submitScores.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearTemplate } = scoringSlice.actions;
export default scoringSlice.reducer;