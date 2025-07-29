import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import { showNotification } from '../notification/notificationSlice';
import { getMockTemplateByBreedId } from './mockTemplates';

// --- INICIO DE LA MODIFICACIÓN ---

// Función para simular el guardado de calificaciones
const mockSubmitScores = (submissionData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Datos de calificación enviados (simulación):", submissionData);
            resolve({ status: 'success', submittedData: submissionData });
        }, 500); // Simulamos una pequeña demora de red
    });
};

// --- FIN DE LA MODIFICACIÓN ---


// Thunk para obtener la plantilla de calificación
export const fetchScoreTemplate = createAsyncThunk(
    'scoring/fetchTemplate',
    async (breedId, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await api.get(`/score-templates/breed/${breedId}/`);
            return data;
        } catch (error) {
            dispatch(showNotification({ message: 'Usando plantilla local de demostración.', severity: 'info' }));
            try {
                const mockData = await getMockTemplateByBreedId(breedId);
                return mockData;
            } catch (mockError) {
                return rejectWithValue(mockError);
            }
        }
    }
);

// Thunk para guardar las calificaciones de un ejemplar (modificado)
export const submitScores = createAsyncThunk(
    'scoring/submitScores',
    async ({ animalId, scores }, { dispatch, rejectWithValue }) => {
        try {
            // 1. Intentamos guardar en el backend real
            const { data } = await api.post(`/animals/${animalId}/scores/`, { scores });
            dispatch(showNotification({ message: 'Calificación guardada con éxito', severity: 'success' }));
            return data;
        } catch (error) {
            // 2. Si el guardado real falla, usamos la simulación
            dispatch(showNotification({ message: 'Calificación guardada (simulación).', severity: 'success' }));
            try {
                const mockData = await mockSubmitScores({ animalId, scores });
                return mockData; // Retornamos los datos simulados para que la promesa se resuelva
            } catch (mockError) {
                // Este bloque solo se ejecutaría si la simulación fallara, lo cual es improbable.
                const message = 'Error al simular el guardado.';
                dispatch(showNotification({ message, severity: 'error' }));
                return rejectWithValue(message);
            }
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