
import React, { useState } from 'react';
import StudentDashboard from '@/components/StudentDashboard';
import VideoPlayer from '@/components/VideoPlayer';
import QuizCenter from '@/components/QuizCenter';
import LearningHub from '@/components/LearningHub';
import Profile from '@/components/Profile';
import BottomNavigation from '@/components/BottomNavigation';
import { StudentProvider } from '@/contexts/StudentContext';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'home':
        return <StudentDashboard />;
      case 'practice':
        return <QuizCenter />;
      case 'learning':
        return <LearningHub />;
      case 'profile':
        return <Profile />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <StudentProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
        <div className="container mx-auto px-4 py-6">
          {renderActiveComponent()}
        </div>
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </StudentProvider>
  );
};

export default Index;
