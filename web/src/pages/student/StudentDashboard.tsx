
import React from 'react';
import StudentHeader from '@/containers/student/StudentHeader';
import MotivationalVideo from '@/containers/student/MotivationalVideo';
import LatestVideos from '@/containers/student/LatestVideos';
import QuickStats from '@/containers/student/QuickStats';
import Announcements from '@/containers/student/Announcements';
import BottomNavigation from '@/components/common/BottomNavigation';
import { useStudentDashboard, useStudentVideos } from '@/hooks/api/useStudent';
import { Card, CardContent } from '@/components/ui/card';

interface StudentDashboardProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ activeTab, onTabChange }) => {
  const { data: dashboardData, isLoading: dashboardLoading } = useStudentDashboard();
  const { data: videosData, isLoading: videosLoading } = useStudentVideos();

  const student = dashboardData?.data?.student;
  const stats = dashboardData?.data?.stats;
  const videos = videosData?.data || [];

  if (dashboardLoading || videosLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
      <div className="px-4 py-6 space-y-6">
        <StudentHeader student={student} />
        <MotivationalVideo />
        <LatestVideos videos={videos} />
        <QuickStats stats={stats} />
        <Announcements />
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
};

export default StudentDashboard;
