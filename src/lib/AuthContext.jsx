import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'hairbyeunice2026';
const SESSION_KEY = 'hbe_admin_session';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const session = sessionStorage.getItem(SESSION_KEY);
    setIsAuthenticated(session === 'true');
    setIsLoadingAuth(false);
  }, []);

  const login = (password) => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoadingAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
