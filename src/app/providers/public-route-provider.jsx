import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './auth-provider';

const PublicRoute = ({ children }) => {
    const { session } = useAuth();
    if (session) return <Navigate to="/" replace />;

    return <>{children}</>;
};

export default PublicRoute;