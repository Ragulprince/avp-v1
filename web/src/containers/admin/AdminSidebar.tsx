
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  BarChart3,
  Settings,
  GraduationCap,
  HelpCircle,
  UserCheck,
  Bell,
  X,
  ClipboardList,
  PieChart
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
  isOpen,
  onClose
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'students',
      label: 'Students',
      icon: Users,
      badge: '1,234'
    },
    {
      id: 'staff',
      label: 'Staff',
      icon: UserCheck,
      badge: null
    },
    {
      id: 'courses',
      label: 'Courses',
      icon: GraduationCap,
      badge: null
    },
    {
      id: 'content',
      label: 'Content',
      icon: BookOpen,
      badge: null
    },
    {
      id: 'tests',
      label: 'Tests',
      icon: FileText,
      badge: null
    },
    {
      id: 'questions',
      label: 'Question Bank',
      icon: HelpCircle,
      badge: null
    },
    {
      id: 'reports',
      label: 'Test Reports',
      icon: PieChart,
      badge: null
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: '3'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  const handleItemClick = (tabId: string) => {
    console.log('AdminSidebar: Menu item clicked:', tabId);
    onTabChange(tabId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-6">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold">Academy Admin</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? 'secondary' : 'ghost'}
                className={`w-full justify-start h-10 px-3 ${
                  isActive 
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handleItemClick(item.id)}
              >
                <Icon className="mr-3 h-4 w-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge 
                    variant="secondary" 
                    className="ml-auto h-5 text-xs bg-gray-200 text-gray-700"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
            <span className="text-sm font-medium">AD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@academy.com</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 lg:bg-white lg:border-r lg:border-gray-200">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AdminSidebar;
