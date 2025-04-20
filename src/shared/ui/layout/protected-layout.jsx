import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../header/header';
import { useAuth } from '../../../app/providers/auth-provider';
import { Navigate } from 'react-router-dom';
import Loader from '../loader/loader';

const ProtectedLayout = () => {
    const { session, isLoading } = useAuth();
    
    if (isLoading) return <Loader />;
    if (!session) return <Navigate to="/login" replace />;
    
    return (
        <React.Fragment>
            <Header />
            <div className="main-wrapper">
                <Outlet />
            </div>
        </React.Fragment>
    );
};

export default ProtectedLayout;
