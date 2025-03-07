import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './auth-provider';
import Loader from '../../shared/ui/loader/loader';

const ProtectedRoute = ({ permission, children }) => {
    const { session, isLoading } = useAuth();
    if (isLoading) return <Loader />;
    if (!session) return <Navigate to={"/login"} replace />;

    return <>{children}</>;
};

export default ProtectedRoute;