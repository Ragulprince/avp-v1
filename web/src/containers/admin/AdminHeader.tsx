
import React, { useState } from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface AdminHeaderProps {
  onMenuClick: () => void;
  onProfileClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick, onProfileClick }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'New student registration', time: '5 minutes ago', type: 'info' },
    { id: 2, title: 'Server maintenance scheduled', time: '1 hour ago', type: 'warning' },
    { id: 3, title: 'Monthly report ready', time: '2 hours ago', type: 'success' }
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Manage your academy</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>

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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/admin.png" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem onClick={onProfileClick} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
