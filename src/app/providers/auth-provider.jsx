import React, { createContext, useContext } from 'react';
import { useSessionQuery } from '../../entities/session/model/session.query';

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const { data, error, isLoading, isError, refetch } = useSessionQuery();
    const value = { session: data || null, isLoading, isError, error: error || null, refetchSession: refetch };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
