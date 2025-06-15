
import React, { useState } from 'react';
import { useProfile } from '@/hooks/api/useAuth';
import Login from './auth/Login';
import StudentDashboard from '@/components/StudentDashboard';
import QuizCenter from '@/components/QuizCenter';
import LearningHub from '@/components/LearningHub';
import Profile from '@/components/Profile';
import BottomNavigation from '@/components/BottomNavigation';

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const { data: profileData, isLoading, error } = useProfile();
  
  const isAuthenticated = !!profileData?.data;
  const userRole = profileData?.data?.role;

  const handleLogin = (userType: 'student' | 'admin') => {
    // Login handled by the Login component
    // This callback is just for UI feedback
    console.log(`Logged in as ${userType}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || error) {
    return <Login onLogin={handleLogin} />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <StudentDashboard />;
      case 'learning':
        return <LearningHub />;
      case 'quiz':
        return <QuizCenter />;
      case 'profile':
        return <Profile />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
        {renderCurrentView()}
      </div>
      <BottomNavigation currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
};

export default Index;
