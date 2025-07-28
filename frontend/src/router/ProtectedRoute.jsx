
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
    const { token } = useSelector((state) => state.auth);

    if (!token) {
        // Si no hay token, redirige al usuario a la página de login
        return <Navigate to="/login" replace />;
    }

    return children;
};
