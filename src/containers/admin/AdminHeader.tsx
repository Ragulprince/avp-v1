
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Menu, 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Mail,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    { 
      id: 1, 
      message: "New student enrollment: John Doe", 
      time: "2 mins ago", 
      type: "info", 
      read: false,
      icon: User
    },
    { 
      id: 2, 
      message: "System maintenance scheduled for tonight", 
      time: "1 hour ago", 
      type: "warning", 
      read: false,
      icon: AlertCircle
    },
    { 
      id: 3, 
      message: "Monthly report generated successfully", 
      time: "3 hours ago", 
      type: "success", 
      read: true,
      icon: CheckCircle
    },
    { 
      id: 4, 
      message: "New message from parent", 
      time: "5 hours ago", 
      type: "info", 
      read: true,
      icon: Mail
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'success': return 'text-green-600 bg-green-50';
      case 'info': 
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const markAsRead = (notificationId: number) => {
    // In a real app, this would update the backend
    console.log(`Marking notification ${notificationId} as read`);
  };

  const navigateToProfile = () => {
    // In a real app, this would navigate to the profile page
    console.log('Navigating to profile page');
    setShowProfile(false);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search students, courses, tests..."
                className="pl-10 w-80 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative hover:bg-gray-100"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center p-0">
                    {unreadCount}
                  </Badge>
                )}
              </Button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowNotifications(false)}
                  />
                  <Card className="absolute right-0 top-full mt-2 w-96 z-20 shadow-xl border-0">
                    <CardContent className="p-0">
                      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">Notifications</h3>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setShowNotifications(false)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        {unreadCount > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => {
                          const IconComponent = notification.icon;
                          return (
                            <div 
                              key={notification.id}
                              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50/50' : ''}`}
                              onClick={() => markAsRead(notification.id)}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                  <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                </div>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="p-3 border-t bg-gray-50">
                        <Button variant="ghost" size="sm" className="w-full text-blue-600 hover:bg-blue-50">
                          View All Notifications
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2"
                onClick={() => setShowProfile(!showProfile)}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" alt="Admin" />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Button>

              {/* Profile Dropdown */}
              {showProfile && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowProfile(false)}
                  />
                  <Card className="absolute right-0 top-full mt-2 w-64 z-20 shadow-xl border-0">
                    <CardContent className="p-0">
                      <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-pink-50">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src="" alt="Admin" />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                              AD
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900">Admin User</p>
                            <p className="text-sm text-gray-600">admin@academy.com</p>
                            <Badge variant="secondary" className="mt-1 text-xs">Administrator</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left hover:bg-gray-100"
                          onClick={navigateToProfile}
                        >
                          <User className="w-4 h-4 mr-3" />
                          View Profile
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left hover:bg-gray-100"
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Settings
                        </Button>
                        <div className="border-t border-gray-100 my-2"></div>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left hover:bg-red-50 text-red-600"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default AdminHeader;
