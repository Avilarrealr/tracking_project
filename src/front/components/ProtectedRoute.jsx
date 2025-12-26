import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useGlobalReducer from "../hooks/useGlobalReducer";

export function ProtectedRoute({ children }) {
    const { store } = useGlobalReducer();

    // Priorizamos el token del store global
    const token = store.token;

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children ? children : <Outlet />;
}