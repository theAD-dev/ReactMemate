import React, { createContext, useState } from 'react';

export const ClientContext = createContext();

const ClientProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    console.log('user: ', user);

    const login = (userData) => setUser(userData);
    const logout = () => setUser(null);


    
    return (
        <ClientContext.Provider value={{ user, login, logout }}>
            {children}
        </ClientContext.Provider>
    )
}

export default ClientProvider