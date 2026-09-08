import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('swiggy_token') || null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' or 'register'

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await authAPI.getProfile();
          setUser(res.data);
        } catch (err) {
          console.error('Auth verification failed', err);
          logout();
        }
      } else {
        // Pre-fill default demo user for instant seamless experience
        const demoUser = localStorage.getItem('swiggy_user');
        if (demoUser) {
          try {
            setUser(JSON.parse(demoUser));
          } catch (e) {}
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const userData = res.data;
    setUser(userData);
    setToken(userData.token);
    localStorage.setItem('swiggy_token', userData.token);
    localStorage.setItem('swiggy_user', JSON.stringify(userData));
    setIsAuthModalOpen(false);
    return userData;
  };

  const register = async (name, email, password, phone, role = 'customer') => {
    const res = await authAPI.register({ name, email, password, phone, role });
    const userData = res.data;
    setUser(userData);
    setToken(userData.token);
    localStorage.setItem('swiggy_token', userData.token);
    localStorage.setItem('swiggy_user', JSON.stringify(userData));
    setIsAuthModalOpen(false);
    return userData;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('swiggy_token');
    localStorage.removeItem('swiggy_user');
  };

  const addAddress = async (address) => {
    if (!token) return;
    const res = await authAPI.addAddress(address);
    setUser(res.data);
    localStorage.setItem('swiggy_user', JSON.stringify(res.data));
  };

  const openLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        addAddress,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openLogin,
        openRegister
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

