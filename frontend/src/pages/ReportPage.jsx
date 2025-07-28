
import React, { useState } from 'react';
import {
    Box,
    Typography,
    Container,
    CircularProgress,
    Alert,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Link as MuiLink,
} from '@mui/material';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { generateReport, resetReportState } from '../redux/reports/reportSlice';

export const ReportPage = () => {
    const dispatch = useDispatch();
    const { reportStatus, reportUrl, isLoading, error } = useSelector((state) => state.reports);

    const [reportType, setReportType] = useState('');

    const handleReportTypeChange = (event) => {
        setReportType(event.target.value);
        dispatch(resetReportState()); // Reset state when report type changes
    };

    const handleGenerateReport = () => {
        if (reportType) {
            dispatch(generateReport(reportType));
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="md">
                <Typography variant="h4" component="h1" gutterBottom>
                    Generación de Reportes
                </Typography>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="report-type-select-label">Tipo de Reporte</InputLabel>
                    <Select
                        labelId="report-type-select-label"
                        id="report-type-select"
                        value={reportType}
                        label="Tipo de Reporte"
                        onChange={handleReportTypeChange}
                    >
                        <MenuItem value="animal_summary">Resumen de Ejemplares</MenuItem>
                        <MenuItem value="scoring_analysis">Análisis de Calificaciones</MenuItem>
                        {/* Add more report types as needed */}
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGenerateReport}
                    disabled={!reportType || isLoading}
                    sx={{ mb: 3 }}
                >
                    {isLoading ? <CircularProgress size={24} /> : 'Generar Reporte'}
                </Button>

                {reportStatus === 'pending' && (
                    <Alert severity="info">Generando reporte... Esto puede tardar unos minutos.</Alert>
                )}

                {reportStatus === 'completed' && reportUrl && (
                    <Alert severity="success">
                        Reporte generado exitosamente. <MuiLink href={reportUrl} target="_blank" rel="noopener">Descargar Reporte</MuiLink>
                    </Alert>
                )}

                {reportStatus === 'failed' && error && (
                    <Alert severity="error">Error al generar el reporte: {error.detail || 'Ha ocurrido un error desconocido.'}</Alert>
                )}
            </Container>
            <Footer />
        </Box>
    );
};
