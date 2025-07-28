
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { AnimalManagementPage } from '../pages/AnimalManagementPage';
import { DashboardPage } from '../pages/DashboardPage';

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
    const { token } = useSelector((state) => state.auth);
    // Si no hay token, redirige al login
    return token ? children : <Navigate to="/login" />;
};

export const AppRouter = () => {
    return (
        <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rutas Protegidas */}
            <Route 
                path="/dashboard" 
                element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} 
            />
            <Route 
                path="/animals" 
                element={<ProtectedRoute><AnimalManagementPage /></ProtectedRoute>} 
            />

            {/* Redirigir a dashboard si la ruta no existe */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
};
