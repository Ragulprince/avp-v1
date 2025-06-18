import React from 'react';
import { useProfile } from '@/hooks/api/useAuth';
import { Navigate } from 'react-router-dom';
import Login from './auth/Login';

const Index = () => {
  const { data: profileData, isLoading, error } = useProfile();

  const isAuthenticated = !!profileData?.data;
  const userRole = profileData?.data?.role;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || error) {
    return <Login />;
  }

  // Redirect based on role
  if (userRole === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/student" replace />;
};

export default Index;
