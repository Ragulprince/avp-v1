
import React, { useState } from 'react';
import AdminSidebar from '@/containers/admin/AdminSidebar';
import AdminHeader from '@/containers/admin/AdminHeader';
import DashboardOverview from '@/containers/admin/DashboardOverview';
import StudentManagement from '@/containers/admin/StudentManagement';
import ContentManagement from '@/containers/admin/ContentManagement';
import TestManagement from '@/containers/admin/TestManagement';
import Analytics from '@/containers/admin/Analytics';
import CourseManagement from '@/containers/admin/CourseManagement';
import QuestionBank from '@/containers/admin/QuestionBank';
import NotificationCenter from '@/containers/admin/NotificationCenter';
import StaffManagement from '@/containers/admin/StaffManagement';
import ProfileSection from '@/components/common/ProfileSection';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const renderContent = () => {
    switch (activeTab) {
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
      case 'notifications':
        return <NotificationCenter />;
      case 'profile':
        return <ProfileSection user={adminUser} showStats={true} />;
      case 'analytics':
        return <Analytics />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col lg:ml-64">
        <AdminHeader 
          onMenuClick={() => setSidebarOpen(true)} 
          onProfileClick={() => setActiveTab('profile')}
        />
        <main className="flex-1 p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
