
import React, { useState } from 'react';
import { useStudent } from '@/contexts/StudentContext';
import StudentHeader from '@/containers/student/StudentHeader';
import MotivationalVideo from '@/containers/student/MotivationalVideo';
import LatestVideos from '@/containers/student/LatestVideos';
import QuickStats from '@/containers/student/QuickStats';
import Announcements from '@/containers/student/Announcements';
import BottomNavigation from '@/components/common/BottomNavigation';

interface StudentDashboardProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ activeTab, onTabChange }) => {
  const { student, videos } = useStudent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
      <div className="px-4 py-6 space-y-6">
        <StudentHeader student={student} />
        <MotivationalVideo />
        <LatestVideos videos={videos} />
        <QuickStats />
        <Announcements />
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
};

export default StudentDashboard;
