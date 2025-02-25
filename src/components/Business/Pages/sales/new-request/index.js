import React from 'react';
import { Outlet } from 'react-router-dom';
import ClientProvider from './client-provider';

const ClientLayout = () => {
    return (
        <ClientProvider>
            <Outlet />
        </ClientProvider>
    );
};

export default ClientLayout;