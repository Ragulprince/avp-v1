import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash2, BookOpen, Users, Clock, GraduationCap } from 'lucide-react';
import { useCourses, useCreateCourse } from '@/hooks/api/useAdmin';
import { CreateCourseData, adminService } from '@/services/admin';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSubjects } from '@/hooks/api/useSubjects';

const CourseManagement = () => {
  const { data: coursesResponse, isLoading } = useCourses();
  const createCourseMutation = useCreateCourse();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: subjectsResponse } = useSubjects();
  
  // Debugging output
  console.log('subjectsResponse:', subjectsResponse);
  let subjects = Array.isArray(subjectsResponse?.data)
    ? subjectsResponse.data
    : Array.isArray(subjectsResponse)
      ? subjectsResponse
      : [];
  console.log('subjects:', subjects);
  
  const courses = coursesResponse?.data || [];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  
  const [newCourse, setNewCourse] = useState<CreateCourseData>({
    name: '',
    description: '',
    duration: 0,
    level: 'BEGINNER',
    category: '',
    prerequisites: [],
    syllabus: [],
    fees: 0,
    max_students: 0,
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString(),
    is_active: true,
    instructor_id: '',
    materials: [],
    assessments: [],
    schedule: {},
    location: '',
    mode: 'ONLINE',
    language: 'ENGLISH',
    certification: true,
    certification_type: '',
    certification_validity: 0,
    rating: 0,
    reviews: [],
    enrollment_count: 0,
    completion_rate: 0,
    tags: [],
    metadata: {},
    subject_ids: [],
  });

  const editCourseMutation = useMutation({
    mutationFn: async (data: { id: string; values: Partial<CreateCourseData> }) => {
      return adminService.updateCourse(data.id, data.values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({ title: 'Success', description: 'Course updated successfully' });
      setIsEditDialogOpen(false);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update course', variant: 'destructive' });
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: async (id: string) => {
      return adminService.deleteCourse(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({ title: 'Success', description: 'Course deleted successfully' });
      setIsDeleteDialogOpen(false);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete course', variant: 'destructive' });
    },
  });

  const filteredCourses = courses.filter(course => {
    return (course.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
           (course.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
  });

  const handleAddCourse = async () => {
    if (!newCourse.name || !newCourse.description) {
      toast({
        title: 'Error',
        description: 'Name and description are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createCourseMutation.mutateAsync(newCourse);
      setNewCourse({
        name: '',
        description: '',
        duration: 0,
        level: 'BEGINNER',
        category: '',
        prerequisites: [],
        syllabus: [],
        fees: 0,
        max_students: 0,
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        is_active: true,
        instructor_id: '',
        materials: [],
        assessments: [],
        schedule: {},
        location: '',
        mode: 'ONLINE',
        language: 'ENGLISH',
        certification: true,
        certification_type: '',
        certification_validity: 0,
        rating: 0,
        reviews: [],
        enrollment_count: 0,
        completion_rate: 0,
        tags: [],
        metadata: {},
        subject_ids: [],
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Failed to create course:', error);
    }
  };

  const openEditDialog = (course: any) => {
    setSelectedCourse(course);
    setNewCourse({
      name: course.name || '',
      description: course.description || '',
      duration: course.duration || 0,
      level: course.level || 'BEGINNER',
      category: course.category || '',
      prerequisites: course.prerequisites || [],
      syllabus: course.syllabus || [],
      fees: course.fees || 0,
      max_students: course.max_students || 0,
      start_date: course.start_date || new Date().toISOString(),
      end_date: course.end_date || new Date().toISOString(),
      is_active: course.is_active || true,
      instructor_id: course.instructor_id || '',
      materials: course.materials || [],
      assessments: course.assessments || [],
      schedule: course.schedule || {},
      location: course.location || '',
      mode: course.mode || 'ONLINE',
      language: course.language || 'ENGLISH',
      certification: course.certification || true,
      certification_type: course.certification_type || '',
      certification_validity: course.certification_validity || 0,
      rating: course.rating || 0,
      reviews: course.reviews || [],
      enrollment_count: course.enrollment_count || 0,
      completion_rate: course.completion_rate || 0,
      tags: course.tags || [],
      metadata: course.metadata || {},
      subject_ids: course.subjects ? course.subjects.map((s: any) => s.subject_id) : (course.subject_ids || []),
    });
    setIsEditDialogOpen(true);
  };

  const handleEditCourse = async () => {
    if (!selectedCourse) return;
    await editCourseMutation.mutateAsync({ id: selectedCourse.id.toString(), values: newCourse });
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;
    await deleteCourseMutation.mutateAsync(selectedCourse.id.toString());
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
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600 mt-1">Manage academy courses and programs</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>
                Fill in the course details below. Fields marked with * are required.
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto pr-6 -mr-6">
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="name">Course Name *</Label>
                  <Input
                    id="name"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                    placeholder="Course name"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                    placeholder="Course category"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                    placeholder="Course description"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({...newCourse, duration: parseInt(e.target.value)})}
                    placeholder="Course duration"
                  />
                </div>
                <div>
                  <Label htmlFor="level">Level</Label>
                  <Select value={newCourse.level} onValueChange={(value) => setNewCourse({...newCourse, level: value as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEGINNER">Beginner</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                      <SelectItem value="ADVANCED">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fees">Fees</Label>
                  <Input
                    id="fees"
                    type="number"
                    value={newCourse.fees}
                    onChange={(e) => setNewCourse({...newCourse, fees: parseFloat(e.target.value)})}
                    placeholder="Course fees"
                  />
                </div>
                <div>
                  <Label htmlFor="max_students">Max Students</Label>
                  <Input
                    id="max_students"
                    type="number"
                    value={newCourse.max_students}
                    onChange={(e) => setNewCourse({...newCourse, max_students: parseInt(e.target.value)})}
                    placeholder="Maximum students"
                  />
                </div>
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={newCourse.start_date.split('T')[0]}
                    onChange={(e) => setNewCourse({...newCourse, start_date: new Date(e.target.value).toISOString()})}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={newCourse.end_date.split('T')[0]}
                    onChange={(e) => setNewCourse({...newCourse, end_date: new Date(e.target.value).toISOString()})}
                  />
                </div>
                <div>
                  <Label htmlFor="mode">Mode</Label>
                  <Select value={newCourse.mode} onValueChange={(value) => setNewCourse({...newCourse, mode: value as 'ONLINE' | 'OFFLINE' | 'HYBRID'})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ONLINE">Online</SelectItem>
                      <SelectItem value="OFFLINE">Offline</SelectItem>
                      <SelectItem value="HYBRID">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={newCourse.language} onValueChange={(value) => setNewCourse({...newCourse, language: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ENGLISH">English</SelectItem>
                      <SelectItem value="HINDI">Hindi</SelectItem>
                      <SelectItem value="TAMIL">Tamil</SelectItem>
                      <SelectItem value="TELUGU">Telugu</SelectItem>
                      <SelectItem value="KANNADA">Kannada</SelectItem>
                      <SelectItem value="MALAYALAM">Malayalam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newCourse.location}
                    onChange={(e) => setNewCourse({...newCourse, location: e.target.value})}
                    placeholder="Course location"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="certification"
                    checked={newCourse.certification}
                    onChange={(e) => setNewCourse({...newCourse, certification: e.target.checked})}
                  />
                  <Label htmlFor="certification">Offers Certification</Label>
                </div>
                <div>
                  <Label htmlFor="certification_type">Certification Type</Label>
                  <Input
                    id="certification_type"
                    value={newCourse.certification_type}
                    onChange={(e) => setNewCourse({...newCourse, certification_type: e.target.value})}
                    placeholder="Certification type"
                  />
                </div>
                <div>
                  <Label htmlFor="certification_validity">Certification Validity (months)</Label>
                  <Input
                    id="certification_validity"
                    type="number"
                    value={newCourse.certification_validity}
                    onChange={(e) => setNewCourse({...newCourse, certification_validity: parseInt(e.target.value)})}
                    placeholder="Validity in months"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={newCourse.is_active}
                    onChange={(e) => setNewCourse({...newCourse, is_active: e.target.checked})}
                  />
                  <Label htmlFor="is_active">Active Course</Label>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="subject_ids">Subjects</Label>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((subject: any) => (
                      <label key={subject.subject_id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newCourse.subject_ids.includes(subject.subject_id)}
                          onChange={e => {
                            if (e.target.checked) {
                              setNewCourse({ ...newCourse, subject_ids: [...newCourse.subject_ids, subject.subject_id] });
                            } else {
                              setNewCourse({ ...newCourse, subject_ids: newCourse.subject_ids.filter((id: number) => id !== subject.subject_id) });
                            }
                          }}
                        />
                        {subject.name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddCourse}
                disabled={createCourseMutation.isPending}
              >
                {createCourseMutation.isPending ? 'Adding...' : 'Add Course'}
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
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold">{courses.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold">{courses.filter(c => c.is_active).length}</p>
              </div>
              <GraduationCap className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold">{courses.reduce((acc, course) => acc + (course.enrollment_count || 0), 0)}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Completion Rate</p>
                <p className="text-2xl font-bold">
                  {courses.length > 0
                    ? Math.round(courses.reduce((acc, course) => acc + (course.completion_rate || 0), 0) / courses.length)
                    : 0}%
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.course_id || course.id} className="flex flex-col">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {course.name?.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{course.name}</h3>
                    <Badge variant={course.is_active ? "default" : "secondary"}>
                      {course.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(course)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedCourse(course);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.category}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration} hours</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{course.enrollment_count || 0} students</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <GraduationCap className="w-4 h-4" />
                  <span>{course.level}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-medium">{new Date(course.start_date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {course.subject_ids && course.subject_ids.map((subject_id: number) => (
                  <Badge key={subject_id} className="bg-blue-100 text-blue-800">
                    {subjects.find(subject => subject.subject_id === subject_id)?.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update course information below.
            </DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <div className="overflow-y-auto pr-6 -mr-6">
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="edit-name">Course Name *</Label>
                  <Input
                    id="edit-name"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                    placeholder="Course name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Input
                    id="edit-category"
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                    placeholder="Course category"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-description">Description *</Label>
                  <Textarea
                    id="edit-description"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                    placeholder="Course description"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-duration">Duration (hours)</Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({...newCourse, duration: parseInt(e.target.value)})}
                    placeholder="Course duration"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-level">Level</Label>
                  <Select value={newCourse.level} onValueChange={(value) => setNewCourse({...newCourse, level: value as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEGINNER">Beginner</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                      <SelectItem value="ADVANCED">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-fees">Fees</Label>
                  <Input
                    id="edit-fees"
                    type="number"
                    value={newCourse.fees}
                    onChange={(e) => setNewCourse({...newCourse, fees: parseFloat(e.target.value)})}
                    placeholder="Course fees"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-max-students">Max Students</Label>
                  <Input
                    id="edit-max-students"
                    type="number"
                    value={newCourse.max_students}
                    onChange={(e) => setNewCourse({...newCourse, max_students: parseInt(e.target.value)})}
                    placeholder="Maximum students"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-start-date">Start Date</Label>
                  <Input
                    id="edit-start-date"
                    type="date"
                    value={newCourse.start_date.split('T')[0]}
                    onChange={(e) => setNewCourse({...newCourse, start_date: new Date(e.target.value).toISOString()})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-end-date">End Date</Label>
                  <Input
                    id="edit-end-date"
                    type="date"
                    value={newCourse.end_date.split('T')[0]}
                    onChange={(e) => setNewCourse({...newCourse, end_date: new Date(e.target.value).toISOString()})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-mode">Mode</Label>
                  <Select value={newCourse.mode} onValueChange={(value) => setNewCourse({...newCourse, mode: value as 'ONLINE' | 'OFFLINE' | 'HYBRID'})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ONLINE">Online</SelectItem>
                      <SelectItem value="OFFLINE">Offline</SelectItem>
                      <SelectItem value="HYBRID">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-language">Language</Label>
                  <Select value={newCourse.language} onValueChange={(value) => setNewCourse({...newCourse, language: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ENGLISH">English</SelectItem>
                      <SelectItem value="HINDI">Hindi</SelectItem>
                      <SelectItem value="TAMIL">Tamil</SelectItem>
                      <SelectItem value="TELUGU">Telugu</SelectItem>
                      <SelectItem value="KANNADA">Kannada</SelectItem>
                      <SelectItem value="MALAYALAM">Malayalam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    value={newCourse.location}
                    onChange={(e) => setNewCourse({...newCourse, location: e.target.value})}
                    placeholder="Course location"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-certification"
                    checked={newCourse.certification}
                    onChange={(e) => setNewCourse({...newCourse, certification: e.target.checked})}
                  />
                  <Label htmlFor="edit-certification">Offers Certification</Label>
                </div>
                <div>
                  <Label htmlFor="edit-certification-type">Certification Type</Label>
                  <Input
                    id="edit-certification-type"
                    value={newCourse.certification_type}
                    onChange={(e) => setNewCourse({...newCourse, certification_type: e.target.value})}
                    placeholder="Certification type"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-certification-validity">Certification Validity (months)</Label>
                  <Input
                    id="edit-certification-validity"
                    type="number"
                    value={newCourse.certification_validity}
                    onChange={(e) => setNewCourse({...newCourse, certification_validity: parseInt(e.target.value)})}
                    placeholder="Validity in months"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-is-active"
                    checked={newCourse.is_active}
                    onChange={(e) => setNewCourse({...newCourse, is_active: e.target.checked})}
                  />
                  <Label htmlFor="edit-is-active">Active Course</Label>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-subject-ids">Subjects</Label>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((subject: any) => (
                      <label key={subject.subject_id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newCourse.subject_ids.includes(subject.subject_id)}
                          onChange={e => {
                            if (e.target.checked) {
                              setNewCourse({ ...newCourse, subject_ids: [...newCourse.subject_ids, subject.subject_id] });
                            } else {
                              setNewCourse({ ...newCourse, subject_ids: newCourse.subject_ids.filter((id: number) => id !== subject.subject_id) });
                            }
                          }}
                        />
                        {subject.name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCourse}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the course
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCourse}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CourseManagement;
