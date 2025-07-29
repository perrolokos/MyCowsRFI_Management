import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
    const { token } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!token) {
        // Redirige a login, guardando la ubicación a la que intentaban acceder
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};