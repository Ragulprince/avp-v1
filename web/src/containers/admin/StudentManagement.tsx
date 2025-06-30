/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash2, Users, UserCheck, GraduationCap, Phone, Mail, BookOpen } from 'lucide-react';
import { useStudents, useCreateStudent, useCourses, useBatches } from '@/hooks/api/useAdmin';
import { CreateStudentData } from '@/services/admin';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin';

const StudentManagement = () => {
  const { data: studentsResponse, isLoading } = useStudents();
  const { data: coursesResponse } = useCourses();
  const { data: batchesResponse } = useBatches();
  const createStudentMutation = useCreateStudent();
  const { toast } = useToast();
  
  const students = studentsResponse?.data || [];
  const courses = coursesResponse?.data || [];
  const batches = batchesResponse?.data || [];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  const [newStudent, setNewStudent] = useState<CreateStudentData>({
    email: '',
    full_name: '',
    phone_number: '',
    batch_id: '',
    course_id: '',
    address: '',
    emergency_contact: '',
    date_of_birth: '',
    gender: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    adhaar_num: '',
    enrollment_number: '',
    qualification: '',
    guardian_name: '',
    guardian_contact: '',
    guardian_email: '',
    guardian_relation: '',
    mobile_number: '',
    bio: '',
    blood_group: '',
    medical_conditions: '',
    achievements: {},
    documents: {}
  });

  const [editStudent, setEditStudent] = useState<CreateStudentData | null>(null);

  const queryClient = useQueryClient();

  const editStudentMutation = useMutation({
    mutationFn: async (data: { id: string; values: Partial<CreateStudentData> }) => {
      return adminService.updateStudent(data.id, data.values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({ title: 'Success', description: 'Student updated successfully' });
      setIsEditDialogOpen(false);
      setEditStudent(null);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update student', variant: 'destructive' });
    },
  });

  const deleteStudentMutation = useMutation({
    mutationFn: async (id: string) => {
      return adminService.deleteStudent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({ title: 'Success', description: 'Student deleted successfully' });
      setIsDeleteDialogOpen(false);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete student', variant: 'destructive' });
    },
  });

   
  const openEditDialog = (student: any) => {
    setSelectedStudent(student);
    setEditStudent({
      email: student.email || '',
      full_name: student.full_name || '',
      phone_number: student.phone_number || '',
      batch_id: student.student_profile?.batch?.batch_id?.toString() || '',
      course_id: student.student_profile?.course?.course_id?.toString() || '',
      address: student.address || '',
      emergency_contact: student.emergency_contact || '',
      date_of_birth: student.date_of_birth ? student.date_of_birth.split('T')[0] : '',
      gender: student.gender || '',
      city: student.city || '',
      state: student.state || '',
      country: student.country || '',
      pincode: student.pincode || '',
      avatar: student.avatar || '',
      role: student.role || 'STUDENT',
      is_active: student.is_active,
      adhaar_num: student.student_profile?.adhaar_num || '',
      enrollment_number: student.student_profile?.enrollment_number || '',
      qualification: student.student_profile?.qualification || '',
      guardian_name: student.student_profile?.guardian_name || '',
      guardian_contact: student.student_profile?.guardian_contact || '',
      guardian_email: student.student_profile?.guardian_email || '',
      guardian_relation: student.student_profile?.guardian_relation || '',
      mobile_number: student.student_profile?.mobile_number || '',
      bio: student.student_profile?.bio || '',
      blood_group: student.student_profile?.blood_group || '',
      medical_conditions: student.student_profile?.medical_conditions || '',
      achievements: student.student_profile?.achievements || {},
      documents: student.student_profile?.documents || {}
    });
    setIsEditDialogOpen(true);
  };

  const handleEditStudent = async () => {
    if (!selectedStudent || !editStudent) return;
    await editStudentMutation.mutateAsync({ id: selectedStudent.user_id.toString(), values: editStudent });
  };

  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;
    await deleteStudentMutation.mutateAsync(selectedStudent.user_id.toString());
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = (student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (student.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesCourse = !selectedCourse || student.student_profile?.course_id === parseInt(selectedCourse);
    const matchesBatch = !selectedBatch || student.student_profile?.batch_id === parseInt(selectedBatch);
    return matchesSearch && matchesCourse && matchesBatch;
  });

  const handleAddStudent = async () => {
    if (!newStudent.email || !newStudent.full_name) {
      toast({
        title: 'Error',
        description: 'Email and full name are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      const studentData: CreateStudentData = {
        ...newStudent,
        batch_id: newStudent.batch_id || undefined,
        course_id: newStudent.course_id || undefined
      };
      
      await createStudentMutation.mutateAsync(studentData);
      setNewStudent({
        email: '',
        full_name: '',
        phone_number: '',
        batch_id: '',
        course_id: '',
        address: '',
        emergency_contact: '',
        date_of_birth: '',
        gender: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        adhaar_num: '',
        enrollment_number: '',
        qualification: '',
        guardian_name: '',
        guardian_contact: '',
        guardian_email: '',
        guardian_relation: '',
        mobile_number: '',
        bio: '',
        blood_group: '',
        medical_conditions: '',
        achievements: {},
        documents: {}
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Failed to create student:', error);
      toast({
        title: 'Error',
        description: 'Failed to create student. Please try again.',
        variant: 'destructive',
      });
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
          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>
                Fill in the student details below. Fields marked with * are required.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto pr-4 -mr-4">
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={newStudent.full_name}
                    onChange={(e) => setNewStudent({...newStudent, full_name: e.target.value})}
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
                  <Label htmlFor="phone_number">Phone</Label>
                  <Input
                    id="phone_number"
                    value={newStudent.phone_number}
                    onChange={(e) => setNewStudent({...newStudent, phone_number: e.target.value})}
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <Label htmlFor="emergency_contact">Emergency Contact</Label>
                  <Input
                    id="emergency_contact"
                    value={newStudent.emergency_contact}
                    onChange={(e) => setNewStudent({...newStudent, emergency_contact: e.target.value})}
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={newStudent.date_of_birth}
                    onChange={(e) => setNewStudent({...newStudent, date_of_birth: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={newStudent.gender} onValueChange={(value) => setNewStudent({...newStudent, gender: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="course">Course</Label>
                  <Select value={newStudent.course_id} onValueChange={(value) => setNewStudent({...newStudent, course_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.course_id} value={course.course_id.toString()}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="batch">Batch</Label>
                  <Select value={newStudent.batch_id} onValueChange={(value) => setNewStudent({...newStudent, batch_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {batches.map((batch) => (
                        <SelectItem key={batch.batch_id} value={batch.batch_id.toString()}>
                          {batch.batch_name}
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
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={newStudent.city}
                    onChange={(e) => setNewStudent({...newStudent, city: e.target.value})}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={newStudent.state}
                    onChange={(e) => setNewStudent({...newStudent, state: e.target.value})}
                    placeholder="State"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={newStudent.country}
                    onChange={(e) => setNewStudent({...newStudent, country: e.target.value})}
                    placeholder="Country"
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={newStudent.pincode}
                    onChange={(e) => setNewStudent({...newStudent, pincode: e.target.value})}
                    placeholder="Pincode"
                  />
                </div>
                <div>
                  <Label htmlFor="adhaar_num">Aadhaar Number</Label>
                  <Input
                    id="adhaar_num"
                    value={newStudent.adhaar_num}
                    onChange={(e) => setNewStudent({...newStudent, adhaar_num: e.target.value})}
                    placeholder="Aadhaar Number"
                  />
                </div>
                <div>
                  <Label htmlFor="enrollment_number">Enrollment Number</Label>
                  <Input
                    id="enrollment_number"
                    value={newStudent.enrollment_number}
                    onChange={(e) => setNewStudent({...newStudent, enrollment_number: e.target.value})}
                    placeholder="Enrollment Number"
                  />
                </div>
                <div>
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    value={newStudent.qualification}
                    onChange={(e) => setNewStudent({...newStudent, qualification: e.target.value})}
                    placeholder="Qualification"
                  />
                </div>
                <div>
                  <Label htmlFor="guardian_name">Guardian Name</Label>
                  <Input
                    id="guardian_name"
                    value={newStudent.guardian_name}
                    onChange={(e) => setNewStudent({...newStudent, guardian_name: e.target.value})}
                    placeholder="Guardian Name"
                  />
                </div>
                <div>
                  <Label htmlFor="guardian_contact">Guardian Contact</Label>
                  <Input
                    id="guardian_contact"
                    value={newStudent.guardian_contact}
                    onChange={(e) => setNewStudent({...newStudent, guardian_contact: e.target.value})}
                    placeholder="Guardian Contact"
                  />
                </div>
                <div>
                  <Label htmlFor="guardian_email">Guardian Email</Label>
                  <Input
                    id="guardian_email"
                    type="email"
                    value={newStudent.guardian_email}
                    onChange={(e) => setNewStudent({...newStudent, guardian_email: e.target.value})}
                    placeholder="Guardian Email"
                  />
                </div>
                <div>
                  <Label htmlFor="guardian_relation">Guardian Relation</Label>
                  <Input
                    id="guardian_relation"
                    value={newStudent.guardian_relation}
                    onChange={(e) => setNewStudent({...newStudent, guardian_relation: e.target.value})}
                    placeholder="Guardian Relation"
                  />
                </div>
                <div>
                  <Label htmlFor="mobile_number">Mobile Number</Label>
                  <Input
                    id="mobile_number"
                    value={newStudent.mobile_number}
                    onChange={(e) => setNewStudent({...newStudent, mobile_number: e.target.value})}
                    placeholder="Mobile Number"
                  />
                </div>
                <div>
                  <Label htmlFor="blood_group">Blood Group</Label>
                  <Select value={newStudent.blood_group} onValueChange={(value) => setNewStudent({...newStudent, blood_group: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="medical_conditions">Medical Conditions</Label>
                  <Textarea
                    id="medical_conditions"
                    value={newStudent.medical_conditions}
                    onChange={(e) => setNewStudent({...newStudent, medical_conditions: e.target.value})}
                    placeholder="Medical Conditions"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={newStudent.bio}
                    onChange={(e) => setNewStudent({...newStudent, bio: e.target.value})}
                    placeholder="Student Bio"
                  />
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 flex justify-end space-x-2 mt-6">
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
                <p className="text-sm font-semibold text-gray-600">Total Students</p>
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
                <p className="text-sm font-semibold text-gray-600">Active Students</p>
                <p className="text-2xl font-bold">{students.filter(s => s.is_active).length}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Enrolled Courses</p>
                <p className="text-2xl font-bold">{students.filter(s => s.student_profile?.course_id).length}</p>
              </div>
              <GraduationCap className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">This Month</p>
                <p className="text-2xl font-bold">{students.filter(s => {
                  const monthAgo = new Date();
                  monthAgo.setMonth(monthAgo.getMonth() - 1);
                  return new Date(s.created_at) > monthAgo;
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
                  <SelectItem key={course.course_id} value={course.course_id.toString()}>
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
                  <SelectItem key={batch.batch_id} value={batch.batch_id.toString()}>
                    {batch.batch_name}
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

      {/* Student List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.user_id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {student.full_name?.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{student.full_name}</h3>
                    <Badge variant={student.is_active ? "default" : "secondary"}>
                      {student.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(student)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedStudent(student);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{student.email}</span>
                </div>
                {student.phone_number && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{student.phone_number}</span>
                  </div>
                )}
                {student.student_profile?.course && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span>{student.student_profile.course.name}</span>
                  </div>
                )}
                {student.student_profile?.batch && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4" />
                    <span>{student.student_profile.batch.batch_name}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Joined:</span>
                  <span className="font-medium">{new Date(student.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update student information below.
            </DialogDescription>
          </DialogHeader>
          {editStudent && (
            <div className="flex-grow overflow-y-auto pr-4 -mr-4">
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <Label htmlFor="edit-name">Full Name *</Label>
                  <Input
                    id="edit-name"
                    value={editStudent.full_name}
                    onChange={(e) => setEditStudent({...editStudent, full_name: e.target.value})}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editStudent.email}
                    onChange={(e) => setEditStudent({...editStudent, email: e.target.value})}
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone Number</Label>
                  <Input
                    id="edit-phone"
                    value={editStudent.phone_number}
                    onChange={(e) => setEditStudent({...editStudent, phone_number: e.target.value})}
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-dob">Date of Birth</Label>
                  <Input
                    id="edit-dob"
                    type="date"
                    value={editStudent.date_of_birth}
                    onChange={(e) => setEditStudent({...editStudent, date_of_birth: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-gender">Gender</Label>
                  <Select value={editStudent.gender || ''} onValueChange={(value) => setEditStudent({...editStudent, gender: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-adhaar">Aadhaar Number</Label>
                  <Input
                    id="edit-adhaar"
                    value={editStudent.adhaar_num}
                    onChange={(e) => setEditStudent({...editStudent, adhaar_num: e.target.value})}
                    placeholder="Aadhaar number"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-enrollment">Enrollment Number</Label>
                  <Input
                    id="edit-enrollment"
                    value={editStudent.enrollment_number}
                    onChange={(e) => setEditStudent({...editStudent, enrollment_number: e.target.value})}
                    placeholder="Enrollment number"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-qualification">Qualification</Label>
                  <Input
                    id="edit-qualification"
                    value={editStudent.qualification}
                    onChange={(e) => setEditStudent({...editStudent, qualification: e.target.value})}
                    placeholder="Qualification"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-guardian-name">Guardian Name</Label>
                  <Input
                    id="edit-guardian-name"
                    value={editStudent.guardian_name}
                    onChange={(e) => setEditStudent({...editStudent, guardian_name: e.target.value})}
                    placeholder="Guardian name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-guardian-contact">Guardian Contact</Label>
                  <Input
                    id="edit-guardian-contact"
                    value={editStudent.guardian_contact}
                    onChange={(e) => setEditStudent({...editStudent, guardian_contact: e.target.value})}
                    placeholder="Guardian contact"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-guardian-email">Guardian Email</Label>
                  <Input
                    id="edit-guardian-email"
                    type="email"
                    value={editStudent.guardian_email}
                    onChange={(e) => setEditStudent({...editStudent, guardian_email: e.target.value})}
                    placeholder="Guardian email"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-guardian-relation">Guardian Relation</Label>
                  <Input
                    id="edit-guardian-relation"
                    value={editStudent.guardian_relation}
                    onChange={(e) => setEditStudent({...editStudent, guardian_relation: e.target.value})}
                    placeholder="Guardian relation"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-mobile">Mobile Number</Label>
                  <Input
                    id="edit-mobile"
                    value={editStudent.mobile_number}
                    onChange={(e) => setEditStudent({...editStudent, mobile_number: e.target.value})}
                    placeholder="Mobile number"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-bio">Bio</Label>
                  <Textarea
                    id="edit-bio"
                    value={editStudent.bio}
                    onChange={(e) => setEditStudent({...editStudent, bio: e.target.value})}
                    placeholder="Student bio"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-blood-group">Blood Group</Label>
                  <Select value={editStudent.blood_group || ''} onValueChange={(value) => setEditStudent({...editStudent, blood_group: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-medical">Medical Conditions</Label>
                  <Textarea
                    id="edit-medical"
                    value={editStudent.medical_conditions}
                    onChange={(e) => setEditStudent({...editStudent, medical_conditions: e.target.value})}
                    placeholder="Medical conditions"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-address">Address</Label>
                  <Textarea
                    id="edit-address"
                    value={editStudent.address}
                    onChange={(e) => setEditStudent({...editStudent, address: e.target.value})}
                    placeholder="Address"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-city">City</Label>
                  <Input
                    id="edit-city"
                    value={editStudent.city}
                    onChange={(e) => setEditStudent({...editStudent, city: e.target.value})}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-state">State</Label>
                  <Input
                    id="edit-state"
                    value={editStudent.state}
                    onChange={(e) => setEditStudent({...editStudent, state: e.target.value})}
                    placeholder="State"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-country">Country</Label>
                  <Input
                    id="edit-country"
                    value={editStudent.country}
                    onChange={(e) => setEditStudent({...editStudent, country: e.target.value})}
                    placeholder="Country"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-pincode">Pincode</Label>
                  <Input
                    id="edit-pincode"
                    value={editStudent.pincode}
                    onChange={(e) => setEditStudent({...editStudent, pincode: e.target.value})}
                    placeholder="Pincode"
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex-shrink-0 flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setEditStudent(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditStudent} disabled={editStudentMutation.isPending}>
              {editStudentMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the student's account
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStudent}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StudentManagement;