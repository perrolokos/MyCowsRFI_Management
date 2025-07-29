import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMockAlerts } from './mockAlertData';

export const fetchAlerts = createAsyncThunk(
    'alerts/fetchAlerts',
    async (_, { rejectWithValue }) => {
        try {
            // En un futuro, aquí iría la llamada a `api.get('/alerts/')`
            const data = await getMockAlerts();
            return data;
        } catch (error) {
            return rejectWithValue("No se pudieron cargar las alertas.");
        }
    }
);

const initialState = {
    items: [],
    unreadCount: 0,
    isLoading: false,
};

const alertSlice = createSlice({
    name: 'alerts',
    initialState,
    reducers: {
        markAsRead(state, action) {
            const alertId = action.payload;
            const alert = state.items.find(a => a.id === alertId);
            if (alert && !alert.is_read) {
                alert.is_read = true;
                state.unreadCount--;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAlerts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAlerts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
                state.unreadCount = action.payload.filter(a => !a.is_read).length;
            });
    }
});

export const { markAsRead } = alertSlice.actions;
export default alertSlice.reducer;