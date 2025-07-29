import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AnimalManagementPage } from '../pages/AnimalManagementPage';
import { ScorePage } from '../pages/ScorePage'; // <-- AÑADIR ESTA LÍNEA
import { ProtectedRoute } from '../components/ProtectedRoute';

export const AppRouter = () => {
    return (
        <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rutas Protegidas */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/animals" element={<ProtectedRoute><AnimalManagementPage /></ProtectedRoute>} />
            {/* AÑADIR ESTA RUTA */}
            <Route path="/animals/:animalId/score" element={<ProtectedRoute><ScorePage /></ProtectedRoute>} />

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};