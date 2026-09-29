import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * ProtectedRoute component to guard admin routes against unauthenticated access
 * @param {{ children: React.ReactNode }} props
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner size="lg" text="Memeriksa autentikasi..." />;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
