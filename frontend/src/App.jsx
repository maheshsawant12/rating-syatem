import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import StoreRatingPage from './pages/StoreRatingPage';
import ChangePassword from './components/User/ChangePassword';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={['normal']}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/store/:id/rating"
        element={
          <ProtectedRoute allowedRoles={['normal']}>
            <StoreRatingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner"
        element={
          <ProtectedRoute allowedRoles={['storeowner']}>
            <StoreOwnerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <ProtectedRoute allowedRoles={['admin', 'normal', 'storeowner']}>
            <ChangePassword />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
