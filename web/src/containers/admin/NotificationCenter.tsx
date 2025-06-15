
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Send, 
  Bell, 
  Users, 
  User, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Info,
  Megaphone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NotificationCenter = () => {
  const { toast } = useToast();
  
  const [notification, setNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    priority: 'medium',
    targetType: 'all',
    targetBatches: [],
    targetStudents: [],
    scheduledAt: '',
    sendEmail: false,
    sendSMS: false
  });

  const batches = [
    { id: 'neet-2024', name: 'NEET 2024', students: 234 },
    { id: 'jee-2024', name: 'JEE Main 2024', students: 189 },
    { id: 'neet-2025', name: 'NEET 2025', students: 156 },
    { id: 'foundation', name: 'Foundation Course', students: 78 }
  ];

  const students = [
    { id: '1', name: 'Priya Sharma', batch: 'NEET 2024', avatar: '' },
    { id: '2', name: 'Arjun Kumar', batch: 'JEE 2024', avatar: '' },
    { id: '3', name: 'Meera Patel', batch: 'NEET 2024', avatar: '' },
    { id: '4', name: 'Raj Singh', batch: 'NEET 2025', avatar: '' },
  ];

  const recentNotifications = [
    {
      id: 1,
      title: 'Exam Schedule Updated',
      message: 'Mock test 3 has been rescheduled to next Monday',
      type: 'warning',
      sentTo: 'NEET 2024 Batch',
      sentAt: '2024-06-14 10:30 AM',
      status: 'sent'
    },
    {
      id: 2,
      title: 'New Study Material Available',
      message: 'Chapter 5 Physics notes have been uploaded',
      type: 'info',
      sentTo: 'All Students',
      sentAt: '2024-06-14 09:15 AM',
      status: 'sent'
    },
    {
      id: 3,
      title: 'Holiday Announcement',
      message: 'Classes will be closed on June 20th for public holiday',
      type: 'info',
      sentTo: 'All Students',
      sentAt: '2024-06-13 05:30 PM',
      status: 'sent'
    }
  ];

  const handleSendNotification = () => {
    if (!notification.title || !notification.message) {
      toast({
        title: "Error",
        description: "Please fill in title and message",
        variant: "destructive"
      });
      return;
    }

    // Calculate recipient count
    let recipientCount = 0;
    if (notification.targetType === 'all') {
      recipientCount = batches.reduce((sum, batch) => sum + batch.students, 0);
    } else if (notification.targetType === 'batch') {
      recipientCount = batches
        .filter(batch => notification.targetBatches.includes(batch.id))
        .reduce((sum, batch) => sum + batch.students, 0);
    } else {
      recipientCount = notification.targetStudents.length;
    }

    toast({
      title: "Notification Sent!",
      description: `Notification sent to ${recipientCount} recipient(s)`,
    });

    // Reset form
    setNotification({
      title: '',
      message: '',
      type: 'info',
      priority: 'medium',
      targetType: 'all',
      targetBatches: [],
      targetStudents: [],
      scheduledAt: '',
      sendEmail: false,
      sendSMS: false
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'info': 
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'info': 
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Notification Center
            </h1>
            <p className="text-gray-600 mt-2">Send announcements and notifications to students</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-purple-100 p-4 rounded-lg text-center">
              <Megaphone className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-purple-800">Broadcast</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="compose" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white shadow-md">
          <TabsTrigger value="compose" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            Compose Notification
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
            Notification History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-50 to-purple-100">
            <CardHeader className="bg-purple-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Send className="w-5 h-5 mr-2" />
                Create New Notification
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-purple-700 font-medium">Title *</Label>
                  <Input
                    id="title"
                    value={notification.title}
                    onChange={(e) => setNotification({ ...notification, title: e.target.value })}
                    placeholder="Enter notification title..."
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-purple-700 font-medium">Type</Label>
                  <Select value={notification.type} onValueChange={(value) => setNotification({ ...notification, type: value })}>
                    <SelectTrigger className="border-purple-200 focus:border-purple-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Information</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-purple-700 font-medium">Message *</Label>
                <Textarea
                  id="message"
                  value={notification.message}
                  onChange={(e) => setNotification({ ...notification, message: e.target.value })}
                  placeholder="Enter your notification message..."
                  rows={4}
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>

              {/* Targeting Options */}
              <div className="space-y-4">
                <Label className="text-purple-700 font-medium">Send To</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="all"
                      checked={notification.targetType === 'all'}
                      onCheckedChange={(checked) => 
                        checked && setNotification({ ...notification, targetType: 'all', targetBatches: [], targetStudents: [] })
                      }
                    />
                    <Label htmlFor="all" className="flex items-center gap-2 cursor-pointer">
                      <Users className="w-4 h-4" />
                      All Students
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="batch"
                      checked={notification.targetType === 'batch'}
                      onCheckedChange={(checked) => 
                        checked && setNotification({ ...notification, targetType: 'batch', targetStudents: [] })
                      }
                    />
                    <Label htmlFor="batch" className="flex items-center gap-2 cursor-pointer">
                      <User className="w-4 h-4" />
                      Specific Batches
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="individual"
                      checked={notification.targetType === 'individual'}
                      onCheckedChange={(checked) => 
                        checked && setNotification({ ...notification, targetType: 'individual', targetBatches: [] })
                      }
                    />
                    <Label htmlFor="individual" className="flex items-center gap-2 cursor-pointer">
                      <User className="w-4 h-4" />
                      Individual Students
                    </Label>
                  </div>
                </div>
              </div>

              {/* Batch Selection */}
              {notification.targetType === 'batch' && (
                <div className="space-y-3">
                  <Label className="text-purple-700 font-medium">Select Batches</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {batches.map((batch) => (
                      <div key={batch.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={batch.id}
                          checked={notification.targetBatches.includes(batch.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNotification({
                                ...notification,
                                targetBatches: [...notification.targetBatches, batch.id]
                              });
                            } else {
                              setNotification({
                                ...notification,
                                targetBatches: notification.targetBatches.filter(id => id !== batch.id)
                              });
                            }
                          }}
                        />
                        <Label htmlFor={batch.id} className="cursor-pointer">
                          {batch.name} ({batch.students} students)
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Individual Student Selection */}
              {notification.targetType === 'individual' && (
                <div className="space-y-3">
                  <Label className="text-purple-700 font-medium">Select Students</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {students.map((student) => (
                      <div key={student.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                        <Checkbox
                          id={student.id}
                          checked={notification.targetStudents.includes(student.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNotification({
                                ...notification,
                                targetStudents: [...notification.targetStudents, student.id]
                              });
                            } else {
                              setNotification({
                                ...notification,
                                targetStudents: notification.targetStudents.filter(id => id !== student.id)
                              });
                            }
                          }}
                        />
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback>
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Label htmlFor={student.id} className="cursor-pointer font-medium">
                            {student.name}
                          </Label>
                          <p className="text-sm text-gray-500">{student.batch}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-purple-700 font-medium">Priority</Label>
                  <Select value={notification.priority} onValueChange={(value) => setNotification({ ...notification, priority: value })}>
                    <SelectTrigger className="border-purple-200 focus:border-purple-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt" className="text-purple-700 font-medium">Schedule (Optional)</Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    value={notification.scheduledAt}
                    onChange={(e) => setNotification({ ...notification, scheduledAt: e.target.value })}
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Delivery Options */}
              <div className="space-y-3">
                <Label className="text-purple-700 font-medium">Delivery Options</Label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sendEmail"
                      checked={notification.sendEmail}
                      onCheckedChange={(checked) => setNotification({ ...notification, sendEmail: !!checked })}
                    />
                    <Label htmlFor="sendEmail" className="flex items-center gap-2 cursor-pointer">
                      <Mail className="w-4 h-4" />
                      Send Email
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sendSMS"
                      checked={notification.sendSMS}
                      onCheckedChange={(checked) => setNotification({ ...notification, sendSMS: !!checked })}
                    />
                    <Label htmlFor="sendSMS" className="flex items-center gap-2 cursor-pointer">
                      <MessageSquare className="w-4 h-4" />
                      Send SMS
                    </Label>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSendNotification} 
                className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-6"
              >
                <Send className="w-5 h-5 mr-2" />
                {notification.scheduledAt ? 'Schedule Notification' : 'Send Notification'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="space-y-4">
            {recentNotifications.map((notif) => (
              <Card key={notif.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-full ${getTypeColor(notif.type)}`}>
                          {getTypeIcon(notif.type)}
                        </div>
                        <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                        <Badge className="bg-green-100 text-green-800">
                          {notif.status}
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-3">{notif.message}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {notif.sentTo}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {notif.sentAt}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationCenter;
