
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showNotification } from '../notification/notificationSlice';

const API_URL = process.env.REACT_APP_API_URL;

// Async thunk for user registration
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.post(API_URL + 'register/', userData);
            dispatch(showNotification({ message: 'Registro exitoso! Ahora puedes iniciar sesión.', severity: 'success' }));
            return response.data;
        } catch (error) {
            const message = error.response && error.response.data && error.response.data.detail
                ? error.response.data.detail
                : error.message;
            dispatch(showNotification({ message: `Error en el registro: ${message}`, severity: 'error' }));
            return rejectWithValue(message);
        }
    }
);

const registerSlice = createSlice({
    name: 'register',
    initialState: {
        isLoading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetRegisterState: (state) => {
            state.isLoading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
                state.success = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export const { resetRegisterState } = registerSlice.actions;
export default registerSlice.reducer;
