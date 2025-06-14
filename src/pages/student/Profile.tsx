
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/contexts/StudentContext';
import { User, Mail, Calendar, Award, LogOut, Settings } from 'lucide-react';
import BottomNavigation from '@/components/common/BottomNavigation';

interface ProfileProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ activeTab, onTabChange }) => {
  const { student } = useStudent();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">
                {student.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
            <p className="text-gray-600">{student.batch}</p>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{student.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm">Joined: January 2024</span>
            </div>
            <div className="flex items-center space-x-3">
              <Award className="w-4 h-4 text-gray-500" />
              <span className="text-sm">Level: Advanced</span>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => onTabChange('settings')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings & Preferences
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Notification Settings
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
};

export default Profile;
