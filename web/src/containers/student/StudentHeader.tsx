import React, { useState } from 'react';
import { Bell, Search, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLogout } from '@/hooks/api/useAuth';
import { useNavigate } from 'react-router-dom';

const StudentHeader = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const logoutMutation = useLogout();
  const navigate = useNavigate();

  const notifications = [
    { id: 1, title: 'New Physics lecture uploaded', time: '2 hours ago', type: 'info' },
    { id: 2, title: 'Mock test scheduled for tomorrow', time: '4 hours ago', type: 'warning' },
    { id: 3, title: 'Assignment deadline approaching', time: '1 day ago', type: 'urgent' }
  ];

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-40">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-bold text-gray-900">Student Portal</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Popover open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center p-0">
                    {notifications.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 mr-4" align="end" sideOffset={5}>
              <div className="p-4 border-b">
                <h3 className="font-semibold">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout} title="Logout">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentHeader;
