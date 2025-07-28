import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showNotification } from '../notification/notificationSlice';

const API_URL = process.env.REACT_APP_API_URL;

// Helper function to get auth token
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? `Bearer ${user.access}` : null;
};

// Async thunk for generating a report (e.g., PDF)
export const generateReport = createAsyncThunk(
    'reports/generateReport',
    async (reportType, { rejectWithValue, dispatch }) => {
        try {
            const token = getAuthToken();
            // Assuming backend has an endpoint like /api/reports/generate/ that takes reportType
            const response = await axios.post(API_URL + 'reports/generate/', { report_type: reportType }, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
            });
            dispatch(showNotification({ message: 'Reporte generado exitosamente!', severity: 'success' }));
            return response.data; // Expecting a message or a URL to the report
        } catch (error) {
            const message = error.response && error.response.data && error.response.data.detail
                ? error.response.data.detail
                : error.message;
            dispatch(showNotification({ message: `Error al generar reporte: ${message}`, severity: 'error' }));
            return rejectWithValue(message);
        }
    }
);

const reportSlice = createSlice({
    name: 'reports',
    initialState: {
        reportStatus: null, // e.g., 'pending', 'completed', 'failed'
        reportUrl: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        resetReportState: (state) => {
            state.reportStatus = null;
            state.reportUrl = null;
            state.isLoading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(generateReport.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.reportStatus = 'pending';
                state.reportUrl = null;
            })
            .addCase(generateReport.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reportStatus = 'completed';
                state.reportUrl = action.payload.report_url; // Assuming backend returns report_url
            })
            .addCase(generateReport.rejected, (state, action) => {
                state.isLoading = false;
                state.reportStatus = 'failed';
                state.error = action.payload;
                state.reportUrl = null;
            });
    },
});

export const { resetReportState } = reportSlice.actions;
export default reportSlice.reducer;