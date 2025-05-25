import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * ProtectedRoute ensures a route is accessible only to authenticated users
 * and optionally only to a specific role (admin, user, owner).
 *
 * @param {string} role - Optional role to restrict the route (e.g., 'admin')
 * @returns The wrapped route if access is granted, otherwise redirects to /login
 */
const ProtectedRoute = ({ role }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
