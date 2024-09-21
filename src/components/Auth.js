
import { createContext, useContext, useState } from 'react';

const Auth = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token') || null);

  const login = (token) => {
    setAccessToken(token);
    localStorage.setItem('access_token', token);
  };

  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem('access_token');
  };

  return (
    <Auth.Provider value={{ accessToken, login, logout }}>
      {children}
    </Auth.Provider>
  );
};

export const useAuth = () => {
  return useContext(Auth);
};








