import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AdminSidebar from '@/containers/admin/AdminSidebar';
import AdminHeader from '@/containers/admin/AdminHeader';
import DashboardOverview from '@/containers/admin/DashboardOverviewNew';
import StudentManagement from '@/containers/admin/StudentManagementNew';
import ContentManagement from '@/containers/admin/ContentManagement';
import TestManagement from '@/containers/admin/TestManagement';
import Analytics from '@/containers/admin/Analytics';
import CourseManagement from '@/containers/admin/CourseManagement';
import QuestionBank from '@/containers/admin/QuestionBank';
import NotificationCenter from '@/containers/admin/NotificationCenter';
import StaffManagement from '@/containers/admin/StaffManagement';
import AdminSettings from '@/containers/admin/AdminSettings';
import TestReports from '@/containers/admin/TestReports';
import ProfileSection from '@/components/common/ProfileSection';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Sample admin user data
  const adminUser = {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@academy.com',
    phone: '+91 9876543210',
    avatar: '',
    role: 'admin' as const,
    joinDate: '2024-01-01',
    address: 'Academy Campus, Education City',
    bio: 'Experienced administrator managing academy operations and student success.',
    emergencyContact: '+91 9876543211'
  };

  const handleTabChange = (tab: string) => {
    console.log('AdminDashboard: Tab change requested to:', tab);
    navigate(`/admin/${tab}`);
    setSidebarOpen(false);
  };

  const handleProfileClick = () => {
    handleTabChange('profile');
  };

  const renderContent = () => {
    console.log('AdminDashboard: Rendering content for tab:', location.pathname.split('/').pop());
    
    switch (location.pathname.split('/').pop()) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'students':
        return <StudentManagement />;
      case 'staff':
        return <StaffManagement />;
      case 'courses':
        return <CourseManagement />;
      case 'content':
        return <ContentManagement />;
      case 'tests':
        return <TestManagement />;
      case 'questions':
        return <QuestionBank />;
      case 'reports':
        return <TestReports />;
      case 'notifications':
        return <NotificationCenter />;
      case 'settings':
        return <AdminSettings />;
      case 'profile':
        return <ProfileSection user={adminUser} showStats={true} />;
      case 'analytics':
        return <Analytics />;
      default:
        console.warn('AdminDashboard: Unknown tab:', location.pathname.split('/').pop());
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar
        activeTab={location.pathname.split('/').pop() || 'dashboard'}
        onTabChange={handleTabChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col lg:ml-64">
        <AdminHeader 
          onMenuClick={() => setSidebarOpen(true)} 
          onProfileClick={handleProfileClick}
        />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
