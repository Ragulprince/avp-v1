
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Play, FileText, TrendingUp } from 'lucide-react';

const DashboardOverview = () => {
  const stats = [
    { title: 'Total Students', value: '1,234', icon: Users, change: '+12%', color: 'text-blue-600' },
    { title: 'Video Views', value: '45,678', icon: Play, change: '+8%', color: 'text-green-600' },
    { title: 'Tests Taken', value: '8,901', icon: FileText, change: '+15%', color: 'text-purple-600' },
    { title: 'Engagement', value: '87%', icon: TrendingUp, change: '+3%', color: 'text-orange-600' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your academy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm ${stat.color}`}>{stat.change} from last month</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm">New student enrolled: John Doe</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm">Video uploaded: Physics Chapter 5</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <p className="text-sm">Test created: Chemistry Mock Test</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Priya Sharma - 98%', 'Arjun Kumar - 96%', 'Meera Patel - 94%'].map((student, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{student}</span>
                  <span className="text-sm text-green-600">High</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
