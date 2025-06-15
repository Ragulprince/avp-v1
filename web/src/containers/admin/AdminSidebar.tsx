
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Video, 
  ClipboardList, 
  HelpCircle, 
  BarChart3, 
  Bell, 
  Settings, 
  X,
  User,
  UserCheck
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'staff', label: 'Staff', icon: UserCheck },
  { id: 'courses', label: 'Courses', icon: GraduationCap },
  { id: 'content', label: 'Content', icon: Video },
  { id: 'tests', label: 'Tests', icon: ClipboardList },
  { id: 'questions', label: 'Question Bank', icon: HelpCircle },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'profile', label: 'Profile', icon: User },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  isOpen, 
  onClose 
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">AVP Academy</h1>
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start space-x-3",
                activeTab === item.id && "bg-blue-600 text-white hover:bg-blue-700"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
