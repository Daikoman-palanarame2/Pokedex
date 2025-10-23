import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (savedToken && savedUser) {
        try {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          
          // Verify token with backend
          const response = await authApi.getMe();
          setUser(response.user);
          localStorage.setItem('user', JSON.stringify(response.user));
        } catch (error) {
          console.error('Token verification failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      const { token: newToken, user: userData } = response;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific error types
      if (error.code === 'ECONNABORTED') {
        return { 
          success: false, 
          error: 'Request timed out. The database might be unavailable. Please try again later.' 
        };
      }
      
      if (error.response?.data?.error === 'DATABASE_UNAVAILABLE') {
        return { 
          success: false, 
          error: 'Database is currently unavailable. User login is temporarily disabled. Please try again later.' 
        };
      }
      
      if (error.response?.data?.error === 'DATABASE_TIMEOUT') {
        return { 
          success: false, 
          error: 'Database connection timeout. Please try again later.' 
        };
      }
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData);
      const { token: newToken, user: newUser } = response;
      
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific error types
      if (error.code === 'ECONNABORTED') {
        return { 
          success: false, 
          error: 'Request timed out. The database might be unavailable. Please try again later.' 
        };
      }
      
      if (error.response?.data?.error === 'DATABASE_UNAVAILABLE') {
        return { 
          success: false, 
          error: 'Database is currently unavailable. User registration is temporarily disabled. Please try again later.' 
        };
      }
      
      if (error.response?.data?.error === 'DATABASE_TIMEOUT') {
        return { 
          success: false, 
          error: 'Database connection timeout. Please try again later.' 
        };
      }
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
