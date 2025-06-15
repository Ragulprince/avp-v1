
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Send, Bell, Users, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { useNotifications } from '@/hooks/api/useNotifications';
import { useStudents } from '@/hooks/api/useAdmin';
import { useToast } from '@/hooks/use-toast';

const NotificationCenter = () => {
  const { toast } = useToast();
  const { data: notificationsResponse, isLoading } = useNotifications();
  const { data: studentsResponse } = useStudents();
  
  const notifications = notificationsResponse?.data || [];
  const students = studentsResponse?.data || [];
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    type: 'GENERAL' as const,
    targetType: 'ALL' as 'ALL' | 'SPECIFIC',
    targetUsers: [] as string[]
  });

  const handleCreateNotification = async () => {
    if (!notificationData.title || !notificationData.message) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      const notificationPayload = {
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type,
        ...(notificationData.targetType === 'SPECIFIC' && {
          userId: notificationData.targetUsers[0]
        })
      };

      // In real app, this would call notificationService
      console.log('Creating notification:', notificationPayload);
      
      toast({
        title: 'Success',
        description: `Notification ${notificationData.targetType === 'ALL' ? 'broadcasted' : 'sent'} successfully`
      });
      
      setIsCreateDialogOpen(false);
      setNotificationData({
        title: '',
        message: '',
        type: 'GENERAL',
        targetType: 'ALL',
        targetUsers: []
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send notification',
        variant: 'destructive'
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'QUIZ': return <MessageSquare className="w-4 h-4" />;
      case 'VIDEO': return <Bell className="w-4 h-4" />;
      case 'ANNOUNCEMENT': return <AlertCircle className="w-4 h-4" />;
      case 'REMINDER': return <CheckCircle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'QUIZ': return 'bg-blue-100 text-blue-800';
      case 'VIDEO': return 'bg-purple-100 text-purple-800';
      case 'ANNOUNCEMENT': return 'bg-orange-100 text-orange-800';
      case 'REMINDER': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const notificationTypes = [
    { value: 'GENERAL', label: 'General' },
    { value: 'QUIZ', label: 'Quiz' },
    { value: 'VIDEO', label: 'Video' },
    { value: 'ANNOUNCEMENT', label: 'Announcement' },
    { value: 'REMINDER', label: 'Reminder' }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notification Center</h1>
          <p className="text-gray-600 mt-1">Send and manage notifications to students</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Notification</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={notificationData.title}
                    onChange={(e) => setNotificationData({...notificationData, title: e.target.value})}
                    placeholder="Notification title"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select value={notificationData.type} onValueChange={(value: any) => setNotificationData({...notificationData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {notificationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={notificationData.message}
                  onChange={(e) => setNotificationData({...notificationData, message: e.target.value})}
                  placeholder="Enter your notification message..."
                  rows={4}
                />
              </div>
              <div>
                <Label>Target Audience</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="all-students"
                      name="target"
                      checked={notificationData.targetType === 'ALL'}
                      onChange={() => setNotificationData({...notificationData, targetType: 'ALL', targetUsers: []})}
                    />
                    <Label htmlFor="all-students">All Students</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="specific-students"
                      name="target"
                      checked={notificationData.targetType === 'SPECIFIC'}
                      onChange={() => setNotificationData({...notificationData, targetType: 'SPECIFIC'})}
                    />
                    <Label htmlFor="specific-students">Specific Students</Label>
                  </div>
                </div>
                {notificationData.targetType === 'SPECIFIC' && (
                  <div className="mt-2">
                    <Select value={notificationData.targetUsers[0] || ''} onValueChange={(value) => setNotificationData({...notificationData, targetUsers: [value]})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id.toString()}>
                            {student.name} ({student.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateNotification}>
                <Send className="w-4 h-4 mr-2" />
                Send Notification
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sent</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
              <Send className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold">{notifications.filter(n => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(n.createdAt) > weekAgo;
                }).length}</p>
              </div>
              <Bell className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Read Rate</p>
                <p className="text-2xl font-bold">85%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">{students.filter(s => s.isActive).length}</p>
              </div>
              <Users className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getTypeIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      <Badge className={getTypeColor(notification.type)}>
                        {notification.type}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{notification.message}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>To: {notification.userId ? 'Specific User' : 'All Students'}</span>
                    <span>•</span>
                    <span>Status: {notification.isRead ? 'Read' : 'Unread'}</span>
                  </div>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No notifications sent yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;
