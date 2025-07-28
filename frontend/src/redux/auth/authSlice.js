
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

// Thunk asíncrono para el login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/token/', credentials);
            // Guardamos el token en localStorage para persistencia
            localStorage.setItem('authToken', response.data.access);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: localStorage.getItem('authToken') || null,
        isLoading: false,
        error: null,
    },
    reducers: {
        logout(state) {
            localStorage.removeItem('authToken');
            state.user = null;
            state.token = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.token = action.payload.access;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
