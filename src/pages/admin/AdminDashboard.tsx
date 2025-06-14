
import React, { useState } from 'react';
import AdminSidebar from '@/containers/admin/AdminSidebar';
import AdminHeader from '@/containers/admin/AdminHeader';
import DashboardOverview from '@/containers/admin/DashboardOverview';
import StudentManagement from '@/containers/admin/StudentManagement';
import ContentManagement from '@/containers/admin/ContentManagement';
import TestManagement from '@/containers/admin/TestManagement';
import Analytics from '@/containers/admin/Analytics';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'students':
        return <StudentManagement />;
      case 'content':
        return <ContentManagement />;
      case 'tests':
        return <TestManagement />;
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
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
