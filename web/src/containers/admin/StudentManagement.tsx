import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash2, Users, UserCheck, GraduationCap, Phone, Mail } from 'lucide-react';
import { useStudents, useCreateStudent, useCourses, useBatches } from '@/hooks/api/useAdmin';
import { CreateStudentData } from '@/services/admin';

const StudentManagement = () => {
  const { data: studentsResponse, isLoading } = useStudents();
  const { data: coursesResponse } = useCourses();
  const { data: batchesResponse } = useBatches();
  const createStudentMutation = useCreateStudent();
  
  const students = studentsResponse?.data || [];
  const courses = coursesResponse?.data || [];
  const batches = batchesResponse?.data || [];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const [newStudent, setNewStudent] = useState<CreateStudentData>({
    email: '',
    name: '',
    phone: '',
    batchId: '',
    courseId: '',
    address: '',
    emergencyContact: ''
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = !selectedCourse || student.studentProfile?.courseId === parseInt(selectedCourse);
    const matchesBatch = !selectedBatch || student.studentProfile?.batchId === parseInt(selectedBatch);
    return matchesSearch && matchesCourse && matchesBatch;
  });

  const handleAddStudent = async () => {
    if (!newStudent.email || !newStudent.name) {
      return;
    }

    try {
      const studentData: CreateStudentData = {
        ...newStudent,
        batchId: newStudent.batchId || undefined, // Keep as string or undefined
        courseId: newStudent.courseId || undefined // Keep as string or undefined
      };
      
      await createStudentMutation.mutateAsync(studentData);
      setNewStudent({
        email: '',
        name: '',
        phone: '',
        batchId: '',
        courseId: '',
        address: '',
        emergencyContact: ''
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Failed to create student:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600 mt-1">Manage enrolled students</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  placeholder="Student name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                  placeholder="student@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                  placeholder="+91 9876543210"
                />
              </div>
              <div>
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={newStudent.emergencyContact}
                  onChange={(e) => setNewStudent({...newStudent, emergencyContact: e.target.value})}
                  placeholder="+91 9876543210"
                />
              </div>
              <div>
                <Label htmlFor="course">Course</Label>
                <Select value={newStudent.courseId} onValueChange={(value) => setNewStudent({...newStudent, courseId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="batch">Batch</Label>
                <Select value={newStudent.batchId} onValueChange={(value) => setNewStudent({...newStudent, batchId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id.toString()}>
                        {batch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={newStudent.address}
                  onChange={(e) => setNewStudent({...newStudent, address: e.target.value})}
                  placeholder="Student address"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddStudent}
                disabled={createStudentMutation.isPending}
              >
                {createStudentMutation.isPending ? 'Adding...' : 'Add Student'}
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
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-2xl font-bold">{students.filter(s => s.isActive).length}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                <p className="text-2xl font-bold">{students.filter(s => s.studentProfile?.courseId).length}</p>
              </div>
              <GraduationCap className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold">{students.filter(s => {
                  const monthAgo = new Date();
                  monthAgo.setMonth(monthAgo.getMonth() - 1);
                  return new Date(s.createdAt) > monthAgo;
                }).length}</p>
              </div>
              <Users className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="All courses" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger>
                <SelectValue placeholder="All batches" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem key={batch.id} value={batch.id.toString()}>
                    {batch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setSelectedCourse('');
              setSelectedBatch('');
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{student.name}</h3>
                    <Badge variant={student.isActive ? "default" : "secondary"}>
                      {student.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{student.email}</span>
                </div>
                {student.phone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{student.phone}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {student.studentProfile?.course && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Course:</span>
                    <span className="font-medium">{student.studentProfile.course.name}</span>
                  </div>
                )}
                {student.studentProfile?.batch && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Batch:</span>
                    <span className="font-medium">{student.studentProfile.batch.name}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Joined:</span>
                  <span className="font-medium">{new Date(student.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Activity</span>
                  <span className="text-sm font-medium">2 days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or add your first student.</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentManagement;