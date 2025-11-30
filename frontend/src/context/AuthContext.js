import React, { createContext, useEffect, useState } from 'react';

import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const persistSession = (token, profile) => {
    localStorage.setItem('token', token);
    setUser(profile);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persistSession(data.token, data.user);
  };

  const signup = async (username, email, password) => {
    const { data } = await api.post('/auth/register', { username, email, password });
    persistSession(data.token, data.user);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, refreshUser: fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;