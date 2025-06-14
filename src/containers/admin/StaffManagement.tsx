
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  UserCheck, 
  Clock, 
  Calendar,
  BookOpen,
  Award,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  subjects: string[];
  joinDate: string;
  experience: string;
  qualifications: string;
  hourlyRate: number;
  totalHours: number;
  monthlyHours: number;
  avatar?: string;
  status: 'active' | 'inactive';
}

const StaffManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');

  const [staff, setStaff] = useState<Staff[]>([
    {
      id: '1',
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh.kumar@academy.com',
      phone: '+91 9876543210',
      position: 'Senior Faculty',
      department: 'Physics',
      subjects: ['Physics', 'Mathematics'],
      joinDate: '2022-01-15',
      experience: '8 years',
      qualifications: 'PhD in Physics, M.Sc Physics',
      hourlyRate: 1500,
      totalHours: 1240,
      monthlyHours: 84,
      status: 'active'
    },
    {
      id: '2',
      name: 'Dr. Priya Sharma',
      email: 'priya.sharma@academy.com',
      phone: '+91 9876543211',
      position: 'Faculty',
      department: 'Chemistry',
      subjects: ['Chemistry', 'Environmental Science'],
      joinDate: '2022-06-10',
      experience: '5 years',
      qualifications: 'PhD in Chemistry, M.Sc Chemistry',
      hourlyRate: 1200,
      totalHours: 890,
      monthlyHours: 76,
      status: 'active'
    },
    {
      id: '3',
      name: 'Prof. Amit Verma',
      email: 'amit.verma@academy.com',
      phone: '+91 9876543212',
      position: 'HOD',
      department: 'Biology',
      subjects: ['Biology', 'Botany', 'Zoology'],
      joinDate: '2021-08-20',
      experience: '12 years',
      qualifications: 'PhD in Biology, M.Sc Botany',
      hourlyRate: 1800,
      totalHours: 1560,
      monthlyHours: 92,
      status: 'active'
    }
  ]);

  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    subjects: [],
    experience: '',
    qualifications: '',
    hourlyRate: 0
  });

  const departments = ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English'];
  const positions = ['Faculty', 'Senior Faculty', 'HOD', 'Assistant Professor', 'Professor'];

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.email || !newStaff.department) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const staffMember: Staff = {
      id: Date.now().toString(),
      ...newStaff,
      subjects: [newStaff.department],
      joinDate: new Date().toISOString().split('T')[0],
      totalHours: 0,
      monthlyHours: 0,
      status: 'active'
    };

    setStaff([...staff, staffMember]);
    setNewStaff({
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      subjects: [],
      experience: '',
      qualifications: '',
      hourlyRate: 0
    });
    setShowAddStaff(false);

    toast({
      title: "Success",
      description: "Staff member added successfully"
    });
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const totalStaff = staff.length;
  const activeStaff = staff.filter(s => s.status === 'active').length;
  const totalHoursThisMonth = staff.reduce((sum, s) => sum + s.monthlyHours, 0);
  const avgHourlyRate = staff.reduce((sum, s) => sum + s.hourlyRate, 0) / staff.length;

  return (
    <div className="space-y-8 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Staff Management
            </h1>
            <p className="text-gray-600 mt-2">Manage faculty and track teaching hours</p>
          </div>
          <Button 
            onClick={() => setShowAddStaff(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Staff Member
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-80" />
            <p className="text-3xl font-bold mb-1">{totalStaff}</p>
            <p className="text-blue-100">Total Staff</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6 text-center">
            <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-80" />
            <p className="text-3xl font-bold mb-1">{activeStaff}</p>
            <p className="text-green-100">Active Staff</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6 text-center">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-80" />
            <p className="text-3xl font-bold mb-1">{totalHoursThisMonth}</p>
            <p className="text-purple-100">Hours This Month</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6 text-center">
            <Award className="w-12 h-12 mx-auto mb-3 opacity-80" />
            <p className="text-3xl font-bold mb-1">₹{Math.round(avgHourlyRate)}</p>
            <p className="text-orange-100">Avg Hourly Rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white shadow-md">
          <TabsTrigger value="overview" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
            Staff Overview
          </TabsTrigger>
          <TabsTrigger value="hours" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            Hours Tracking
          </TabsTrigger>
          <TabsTrigger value="payroll" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            Payroll Summary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Search and Filter */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search staff by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Staff List */}
          <div className="grid gap-4">
            {filteredStaff.map((member) => (
              <Card key={member.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                          <Badge className={member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {member.status}
                          </Badge>
                          <Badge variant="outline">{member.position}</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{member.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{member.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            <span>{member.department}</span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Subjects:</strong> {member.subjects.join(', ')}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Experience:</strong> {member.experience} | <strong>Rate:</strong> ₹{member.hourlyRate}/hour
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hours" className="space-y-6">
          <div className="grid gap-4">
            {staff.map((member) => (
              <Card key={member.id} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{member.monthlyHours}</p>
                        <p className="text-sm text-gray-600">This Month</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">{member.totalHours}</p>
                        <p className="text-sm text-gray-600">Total Hours</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">₹{member.hourlyRate * member.monthlyHours}</p>
                        <p className="text-sm text-gray-600">Monthly Earning</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Monthly Payroll Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staff.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.monthlyHours} hours</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">₹{member.hourlyRate * member.monthlyHours}</p>
                      <p className="text-sm text-gray-600">@₹{member.hourlyRate}/hour</p>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold">Total Monthly Payroll:</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{staff.reduce((sum, s) => sum + (s.hourlyRate * s.monthlyHours), 0)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Staff Modal */}
      {showAddStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Add New Staff Member</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Select value={newStaff.position} onValueChange={(value) => setNewStaff({...newStaff, position: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map(pos => (
                        <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Select value={newStaff.department} onValueChange={(value) => setNewStaff({...newStaff, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate (₹)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={newStaff.hourlyRate}
                    onChange={(e) => setNewStaff({...newStaff, hourlyRate: parseInt(e.target.value)})}
                    placeholder="Enter hourly rate"
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Experience</Label>
                  <Input
                    id="experience"
                    value={newStaff.experience}
                    onChange={(e) => setNewStaff({...newStaff, experience: e.target.value})}
                    placeholder="e.g., 5 years"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="qualifications">Qualifications</Label>
                <Textarea
                  id="qualifications"
                  value={newStaff.qualifications}
                  onChange={(e) => setNewStaff({...newStaff, qualifications: e.target.value})}
                  placeholder="Enter qualifications"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddStaff(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddStaff}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Add Staff Member
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
