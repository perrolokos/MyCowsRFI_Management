import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import { showNotification } from '../notification/notificationSlice';

// Thunk para login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await api.post('/token/', credentials);
            localStorage.setItem('authToken', data.access);
            dispatch(showNotification({ message: 'Inicio de sesión exitoso', severity: 'success' }));
            return data;
        } catch (error) {
            const message = error.response?.data?.detail || 'Credenciales inválidas.';
            dispatch(showNotification({ message, severity: 'error' }));
            return rejectWithValue(message);
        }
    }
);

// Thunk para registro
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await api.post('/register/', userData);
            dispatch(showNotification({ message: 'Registro exitoso. Por favor, inicia sesión.', severity: 'success' }));
            return data;
        } catch (error) {
            const message = error.response?.data?.detail || 'Error en el registro.';
            dispatch(showNotification({ message, severity: 'error' }));
            return rejectWithValue(message);
        }
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('authToken') || null,
        isLoading: false,
        error: null,
    },
    reducers: {
        logout(state) {
            localStorage.removeItem('authToken');
            state.token = null;
            state.error = null;
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
            })
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;