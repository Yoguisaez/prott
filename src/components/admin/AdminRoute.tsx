import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user } = useAuth();

  // If not logged in or not an admin, redirect to home
  // In a real app, you might want to redirect to login or a 403 page
  if (!user || user.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
