import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../shared/lib/query-client';

export const ReactQueryProvider = ({ children }) => {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};