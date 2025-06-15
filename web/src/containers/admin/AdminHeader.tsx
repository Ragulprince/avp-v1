
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Menu, Bell, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useProfile } from '@/hooks/api/useAuth';

interface AdminHeaderProps {
  onMenuClick: () => void;
  onProfileClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick, onProfileClick }) => {
  const { data: profileData } = useProfile();
  const adminUser = profileData?.data;

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
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
          
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search students, courses..."
                className="pl-10 w-80"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              3
            </Badge>
          </Button>

          <Button
            variant="ghost"
            className="flex items-center space-x-2"
            onClick={onProfileClick}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={adminUser?.avatar || ''} />
              <AvatarFallback>
                {adminUser?.name ? adminUser.name.split(' ').map(n => n[0]).join('') : 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium">{adminUser?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500">{adminUser?.role || 'Administrator'}</p>
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
