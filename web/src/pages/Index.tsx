
import React, { useState } from 'react';
import { useProfile } from '@/hooks/api/useAuth';
import Login from './auth/Login';
import AdminDashboard from './admin/AdminDashboard';
import StudentDashboard from './student/StudentDashboard';
import VideoLearning from './student/VideoLearning';
import QuizCenter from './student/QuizCenter';
import Profile from './student/Profile';
import Settings from './student/Settings';
import { StudentProvider } from '@/contexts/StudentContext';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { data: profileData, isLoading, error } = useProfile();

  const isAuthenticated = !!profileData?.data;
  const userRole = profileData?.data?.role;

  const handleLogin = (type: 'student' | 'admin') => {
    // Login handled by the Login component through API
    console.log(`Login attempt as ${type}`);
  };

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
    return <Login onLogin={handleLogin} />;
  }

  // Admin Dashboard
  if (userRole === 'ADMIN') {
    return <AdminDashboard />;
  }

  // Student Interface
  const renderStudentContent = () => {
    switch (activeTab) {
      case 'home':
        return <StudentDashboard activeTab={activeTab} onTabChange={setActiveTab} />;
      case 'practice':
        return <QuizCenter activeTab={activeTab} onTabChange={setActiveTab} />;
      case 'hub':
        return <VideoLearning activeTab={activeTab} onTabChange={setActiveTab} />;
      case 'profile':
        return <Profile activeTab={activeTab} onTabChange={setActiveTab} />;
      case 'settings':
        return <Settings activeTab={activeTab} onTabChange={setActiveTab} />;
      default:
        return <StudentDashboard activeTab={activeTab} onTabChange={setActiveTab} />;
    }
  };

  return (
    <StudentProvider>
      {renderStudentContent()}
    </StudentProvider>
  );
};

export default Index;
