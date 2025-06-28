
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Play, FileText, TrendingUp, Bell, Send, Calendar, Clock, Star, Award } from 'lucide-react';
import { useStudents, useCourses, useBatches, useStaff } from '@/hooks/api/useAdmin';

const DashboardOverview = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { data: studentsData, isLoading: studentsLoading } = useStudents();
  const students = studentsData?.data || [];
  const stats = [
    { title: 'Total Students', value: students.length , icon: Users, change: '+12%', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { title: 'Video Views', value: '45,678', icon: Play, change: '+8%', color: 'text-green-600', bgColor: 'bg-green-50' },
    { title: 'Tests Taken', value: '8,901', icon: FileText, change: '+15%', color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { title: 'Engagement', value: '87%', icon: TrendingUp, change: '+3%', color: 'text-orange-600', bgColor: 'bg-orange-50' }
  ];

  const notifications = [
    { id: 1, message: "New student enrolled: John Doe", time: "2 mins ago", type: "info", read: false },
    { id: 2, message: "System maintenance scheduled for tonight", time: "1 hour ago", type: "warning", read: false },
    { id: 3, message: "Monthly report is ready", time: "3 hours ago", type: "success", read: true },
  ];

  const recentActivities = [
    { id: 1, action: 'New student enrolled', name: 'John Doe', time: '5 minutes ago', type: 'student', color: 'bg-green-500' },
    { id: 2, action: 'Video uploaded', name: 'Physics Chapter 5', time: '1 hour ago', type: 'content', color: 'bg-blue-500' },
    { id: 3, action: 'Test created', name: 'Chemistry Mock Test', time: '2 hours ago', type: 'test', color: 'bg-purple-500' },
    { id: 4, action: 'Student achieved', name: 'Priya scored 98%', time: '3 hours ago', type: 'achievement', color: 'bg-yellow-500' },
  ];

  const topStudents = [
    { name: 'Priya Sharma', score: '98%', avatar: '', rank: 1, improvement: '+2%' },
    { name: 'Arjun Kumar', score: '96%', avatar: '', rank: 2, improvement: '+5%' },
    { name: 'Meera Patel', score: '94%', avatar: '', rank: 3, improvement: '+1%' },
    { name: 'Raj Singh', score: '92%', avatar: '', rank: 4, improvement: '+3%' },
  ];

  const quickActions = [
    { title: 'Send Notification', icon: Send, color: 'bg-blue-500 hover:bg-blue-600' },
    { title: 'Create Test', icon: FileText, color: 'bg-green-500 hover:bg-green-600' },
    { title: 'Upload Content', icon: Play, color: 'bg-purple-500 hover:bg-purple-600' },
    { title: 'View Analytics', icon: TrendingUp, color: 'bg-orange-500 hover:bg-orange-600' },
  ];

  return (
    <div className="space-y-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen p-6">
      {/* Enhanced Header */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Welcome back! Here's what's happening with your academy.</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  className={`${action.color} text-white p-4 h-auto flex flex-col items-center gap-2 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-medium">{action.title}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
              <CardContent className="p-0">
                <div className={`${stat.bgColor} px-6 py-4`}>
                  <div className="flex items-center justify-between">
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                    <Badge variant="secondary" className="bg-white/80 text-gray-700">
                      {stat.change}
                    </Badge>
                  </div>
                </div>
                <div className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">from last month</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Enhanced Recent Activities */}
        <Card className="xl:col-span-2 border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className={`w-3 h-3 ${activity.color} rounded-full flex-shrink-0`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.name}</p>
                  </div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Top Students */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {topStudents.map((student, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {index < 3 && (
                        <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' : 
                          index === 1 ? 'bg-gray-400 text-white' : 
                          'bg-orange-500 text-white'
                        }`}>
                          {student.rank}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{student.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-green-600">{student.score}</span>
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          {student.improvement}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {index === 0 && <Award className="w-5 h-5 text-yellow-500" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-80" />
            <p className="text-3xl font-bold mb-1">95%</p>
            <p className="text-blue-100">Student Satisfaction</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-80" />
            <p className="text-3xl font-bold mb-1">78%</p>
            <p className="text-green-100">Course Completion</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6 text-center">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-80" />
            <p className="text-3xl font-bold mb-1">456</p>
            <p className="text-purple-100">Tests This Month</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6 text-center">
            <Play className="w-12 h-12 mx-auto mb-3 opacity-80" />
            <p className="text-3xl font-bold mb-1">12K</p>
            <p className="text-orange-100">Video Hours Watched</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
