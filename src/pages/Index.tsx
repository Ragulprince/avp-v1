
import React, { useState } from 'react';
import Login from './auth/Login';
import AdminDashboard from './admin/AdminDashboard';
import StudentDashboard from './student/StudentDashboard';
import VideoLearning from './student/VideoLearning';
import QuizCenter from './student/QuizCenter';
import Profile from './student/Profile';
import Settings from './student/Settings';
import { StudentProvider } from '@/contexts/StudentContext';

const Index = () => {
  const [userType, setUserType] = useState<'student' | 'admin' | null>(null);
  const [activeTab, setActiveTab] = useState('home');

  const handleLogin = (type: 'student' | 'admin') => {
    setUserType(type);
  };

  if (!userType) {
    return <Login onLogin={handleLogin} />;
  }

  if (userType === 'admin') {
    return <AdminDashboard />;
  }

  const renderStudentContent = () => {
    switch (activeTab) {
      case 'home':
        return <StudentDashboard activeTab={activeTab} onTabChange={setActiveTab} />;
      case 'practice':
        return <QuizCenter activeTab={activeTab} onTabChange={setActiveTab} />;
      case 'learning':
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
