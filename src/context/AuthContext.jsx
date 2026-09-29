import React, { createContext, useState, useEffect, useCallback } from 'react';
import { isFirebaseConfigured } from '../firebase/config';
import {
  loginAdmin,
  logoutAdmin,
  onAuthChange,
  getCurrentUser
} from '../firebase/services/authService';

/**
 * Authentication Context for Bengkulu Utara Culture Website
 */
export const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  loginAdmin: async () => {},
  logoutAdmin: async () => {},
  isAuthenticated: false,
  isConfigured: false
});

/**
 * AuthProvider component wrapping application or admin routes
 * @param {{ children: React.ReactNode }} props
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => (isFirebaseConfigured ? getCurrentUser() : null));
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    // If Firebase is not configured, skip auth listener and provide null user
    if (!isFirebaseConfigured) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Subscribe to auth state changes
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  /**
   * Log in user with email and password
   * @param {string} email
   * @param {string} password
   */
  const login = useCallback(async (email, password) => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase Auth belum dikonfigurasi. Periksa file konfigurasi .env Anda.');
    }
    const loggedUser = await loginAdmin(email, password);
    setUser(loggedUser);
    return loggedUser;
  }, []);

  /**
   * Log out current user
   */
  const logout = useCallback(async () => {
    if (!isFirebaseConfigured) {
      setUser(null);
      return;
    }
    await logoutAdmin();
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    loginAdmin: login,
    logoutAdmin: logout,
    isAuthenticated: Boolean(user),
    isConfigured: isFirebaseConfigured
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
