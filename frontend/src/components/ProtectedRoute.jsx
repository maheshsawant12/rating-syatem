import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role'); 
    const tokenExists = true; 

    if (tokenExists && allowedRoles.includes(role)) {
      setIsAllowed(true);
    }
    setLoading(false);
  }, [allowedRoles]);

  if (loading) return <div>Loading...</div>;

  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
