import React, { createContext } from 'react';
import { useSessionStorage } from "@uidotdev/usehooks";

export const ClientContext = createContext();

const ClientProvider = ({ children }) => {
    const [quoteFormData, setQuoteFormData] = useSessionStorage("formData", "");
    
    return (
        <ClientContext.Provider value={{ quoteFormData, setQuoteFormData }}>
            {children}
        </ClientContext.Provider>
    );
};

export default ClientProvider;