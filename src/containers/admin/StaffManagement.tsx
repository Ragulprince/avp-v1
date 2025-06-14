
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Clock,
  Calendar,
  DollarSign,
  User,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  FileText,
  Award
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'teacher' | 'admin' | 'support';
  subjects: string[];
  joinDate: string;
  avatar: string;
  address: string;
  qualification: string;
  experience: number;
  hourlyRate: number;
  totalHours: number;
  monthlyHours: number;
  status: 'active' | 'inactive';
}

interface HourLog {
  id: string;
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
  batch: string;
  hours: number;
  status: 'completed' | 'pending' | 'cancelled';
}

const StaffManagement = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showAddHours, setShowAddHours] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const { toast } = useToast();

  const [staff, setStaff] = useState<Staff[]>([
    {
      id: '1',
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh.kumar@academy.com',
      phone: '+91 9876543210',
      role: 'teacher',
      subjects: ['Physics', 'Mathematics'],
      joinDate: '2023-01-15',
      avatar: '',
      address: 'Mumbai, Maharashtra',
      qualification: 'PhD in Physics',
      experience: 8,
      hourlyRate: 1500,
      totalHours: 240,
      monthlyHours: 45,
      status: 'active'
    },
    {
      id: '2',
      name: 'Prof. Priya Sharma',
      email: 'priya.sharma@academy.com',
      phone: '+91 9876543211',
      role: 'teacher',
      subjects: ['Chemistry', 'Biology'],
      joinDate: '2023-03-20',
      avatar: '',
      address: 'Delhi, India',
      qualification: 'MSc Chemistry',
      experience: 5,
      hourlyRate: 1200,
      totalHours: 180,
      monthlyHours: 38,
      status: 'active'
    }
  ]);

  const [hourLogs, setHourLogs] = useState<HourLog[]>([
    {
      id: '1',
      staffId: '1',
      date: '2024-01-15',
      startTime: '09:00',
      endTime: '11:00',
      subject: 'Physics',
      batch: 'NEET 2024',
      hours: 2,
      status: 'completed'
    },
    {
      id: '2',
      staffId: '1',
      date: '2024-01-16',
      startTime: '14:00',
      endTime: '16:30',
      subject: 'Mathematics',
      batch: 'JEE 2024',
      hours: 2.5,
      status: 'completed'
    }
  ]);

  const [newStaff, setNewStaff] = useState<{
    name: string;
    email: string;
    phone: string;
    role: 'teacher' | 'admin' | 'support';
    subjects: string[];
    address: string;
    qualification: string;
    experience: number;
    hourlyRate: number;
  }>({
    name: '',
    email: '',
    phone: '',
    role: 'teacher',
    subjects: [],
    address: '',
    qualification: '',
    experience: 0,
    hourlyRate: 0
  });

  const [newHourLog, setNewHourLog] = useState<{
    staffId: string;
    date: string;
    startTime: string;
    endTime: string;
    subject: string;
    batch: string;
    status: 'completed' | 'pending' | 'cancelled';
  }>({
    staffId: '',
    date: '',
    startTime: '',
    endTime: '',
    subject: '',
    batch: '',
    status: 'completed'
  });

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.email || !newStaff.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const staff_member: Staff = {
      id: Date.now().toString(),
      ...newStaff,
      joinDate: new Date().toISOString().split('T')[0],
      avatar: '',
      totalHours: 0,
      monthlyHours: 0,
      status: 'active'
    };

    setStaff(prev => [...prev, staff_member]);
    setNewStaff({
      name: '',
      email: '',
      phone: '',
      role: 'teacher',
      subjects: [],
      address: '',
      qualification: '',
      experience: 0,
      hourlyRate: 0
    });
    setShowAddStaff(false);
    
    toast({
      title: "Success",
      description: "Staff member added successfully.",
    });
  };

  const handleAddHours = () => {
    if (!newHourLog.staffId || !newHourLog.date || !newHourLog.startTime || !newHourLog.endTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const startTime = new Date(`2000-01-01T${newHourLog.startTime}`);
    const endTime = new Date(`2000-01-01T${newHourLog.endTime}`);
    const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    const hourLog: HourLog = {
      id: Date.now().toString(),
      ...newHourLog,
      hours
    };

    setHourLogs(prev => [...prev, hourLog]);
    
    // Update staff hours
    setStaff(prev => prev.map(member => 
      member.id === newHourLog.staffId 
        ? { ...member, totalHours: member.totalHours + hours, monthlyHours: member.monthlyHours + hours }
        : member
    ));

    setNewHourLog({
      staffId: '',
      date: '',
      startTime: '',
      endTime: '',
      subject: '',
      batch: '',
      status: 'completed'
    });
    setShowAddHours(false);
    
    toast({
      title: "Success",
      description: "Hours logged successfully.",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'support': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600">Manage teaching staff and track their hours</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAddHours} onOpenChange={setShowAddHours}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Log Hours
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog open={showAddStaff} onOpenChange={setShowAddStaff}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Staff
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold">{staff.length}</p>
              </div>
              <User className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Teachers</p>
                <p className="text-2xl font-bold">{staff.filter(s => s.role === 'teacher' && s.status === 'active').length}</p>
              </div>
              <GraduationCap className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hours This Month</p>
                <p className="text-2xl font-bold">{staff.reduce((sum, s) => sum + s.monthlyHours, 0)}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Payroll</p>
                <p className="text-2xl font-bold">₹{staff.reduce((sum, s) => sum + (s.monthlyHours * s.hourlyRate), 0).toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Staff List</TabsTrigger>
          <TabsTrigger value="hours">Hour Logs</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Staff Members</CardTitle>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search staff..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-64"
                    />
                  </div>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredStaff.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-gray-900">{member.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          {member.email}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getRoleColor(member.role)}>
                            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {member.subjects.join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div className="text-sm">
                        <p className="font-medium">{member.monthlyHours}h this month</p>
                        <p className="text-gray-600">₹{member.hourlyRate}/hour</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedStaff(member)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Hour Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hourLogs.map((log) => {
                  const staffMember = staff.find(s => s.id === log.staffId);
                  return (
                    <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{staffMember?.name}</h3>
                          <p className="text-sm text-gray-600">{log.subject} - {log.batch}</p>
                          <p className="text-sm text-gray-500">{log.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{log.hours} hours</p>
                        <p className="text-sm text-gray-600">{log.startTime} - {log.endTime}</p>
                        <Badge className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Payroll</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staff.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{(member.monthlyHours * member.hourlyRate).toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{member.monthlyHours}h × ₹{member.hourlyRate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Staff Dialog */}
      <Dialog open={showAddStaff} onOpenChange={setShowAddStaff}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={newStaff.name}
                onChange={(e) => setNewStaff(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newStaff.email}
                onChange={(e) => setNewStaff(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={newStaff.phone}
                onChange={(e) => setNewStaff(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={newStaff.role} onValueChange={(value: 'teacher' | 'admin' | 'support') => setNewStaff(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subjects">Subjects (comma separated)</Label>
              <Input
                id="subjects"
                value={newStaff.subjects.join(', ')}
                onChange={(e) => setNewStaff(prev => ({ ...prev, subjects: e.target.value.split(',').map(s => s.trim()) }))}
                placeholder="Physics, Mathematics"
              />
            </div>
            <div>
              <Label htmlFor="hourlyRate">Hourly Rate (₹)</Label>
              <Input
                id="hourlyRate"
                type="number"
                value={newStaff.hourlyRate}
                onChange={(e) => setNewStaff(prev => ({ ...prev, hourlyRate: Number(e.target.value) }))}
                placeholder="1500"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                value={newStaff.qualification}
                onChange={(e) => setNewStaff(prev => ({ ...prev, qualification: e.target.value }))}
                placeholder="PhD in Physics"
              />
            </div>
            <div>
              <Label htmlFor="experience">Experience (years)</Label>
              <Input
                id="experience"
                type="number"
                value={newStaff.experience}
                onChange={(e) => setNewStaff(prev => ({ ...prev, experience: Number(e.target.value) }))}
                placeholder="5"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={newStaff.address}
                onChange={(e) => setNewStaff(prev => ({ ...prev, address: e.target.value }))}
                placeholder="City, State"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowAddStaff(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStaff}>
              Add Staff Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Hours Dialog */}
      <Dialog open={showAddHours} onOpenChange={setShowAddHours}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Teaching Hours</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="staff">Staff Member *</Label>
              <Select value={newHourLog.staffId} onValueChange={(value) => setNewHourLog(prev => ({ ...prev, staffId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {staff.filter(s => s.role === 'teacher').map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={newHourLog.date}
                  onChange={(e) => setNewHourLog(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newHourLog.subject}
                  onChange={(e) => setNewHourLog(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Physics"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newHourLog.startTime}
                  onChange={(e) => setNewHourLog(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newHourLog.endTime}
                  onChange={(e) => setNewHourLog(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="batch">Batch</Label>
              <Input
                id="batch"
                value={newHourLog.batch}
                onChange={(e) => setNewHourLog(prev => ({ ...prev, batch: e.target.value }))}
                placeholder="NEET 2024"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowAddHours(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddHours}>
              Log Hours
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffManagement;
