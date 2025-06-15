
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash2, BookOpen, Users, Video, FileText } from 'lucide-react';
import { useCourses, useCreateCourse } from '@/hooks/api/useAdmin';
import { CreateCourseData } from '@/services/admin';

const CourseManagement = () => {
  const { data: coursesResponse, isLoading } = useCourses();
  const createCourseMutation = useCreateCourse();
  
  const courses = coursesResponse?.data || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const [newCourse, setNewCourse] = useState<CreateCourseData>({
    name: '',
    description: '',
    duration: 12,
    fees: 0,
    subjects: []
  });

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCourse = async () => {
    if (!newCourse.name || !newCourse.fees || newCourse.subjects.length === 0) {
      return;
    }

    try {
      await createCourseMutation.mutateAsync(newCourse);
      setNewCourse({
        name: '',
        description: '',
        duration: 12,
        fees: 0,
        subjects: []
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Failed to create course:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600 mt-1">Create and manage academy courses</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-2">
                <Label htmlFor="name">Course Name *</Label>
                <Input
                  id="name"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                  placeholder="NEET 2024 Preparation"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                  placeholder="Comprehensive NEET preparation course..."
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (months) *</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newCourse.duration}
                  onChange={(e) => setNewCourse({...newCourse, duration: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="fees">Fees (₹) *</Label>
                <Input
                  id="fees"
                  type="number"
                  value={newCourse.fees}
                  onChange={(e) => setNewCourse({...newCourse, fees: parseInt(e.target.value)})}
                  placeholder="50000"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="subjects">Subjects (comma separated) *</Label>
                <Input
                  id="subjects"
                  value={newCourse.subjects.join(', ')}
                  onChange={(e) => setNewCourse({
                    ...newCourse, 
                    subjects: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  })}
                  placeholder="Physics, Chemistry, Biology, Mathematics"
                />
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
                {createCourseMutation.isPending ? 'Creating...' : 'Create Course'}
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
                <p className="text-2xl font-bold">{courses.filter(c => c.status === 'ACTIVE').length}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold">{courses.reduce((sum, c) => sum + (c._count?.students || 0), 0)}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">₹{courses.reduce((sum, c) => sum + (c.fees * (c._count?.students || 0)), 0).toLocaleString()}</p>
              </div>
              <FileText className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{course.name}</h3>
                    <Badge className={getStatusColor(course.status)}>
                      {course.status}
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
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {course.description || 'No description available'}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{course.duration} months</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Fees:</span>
                  <span className="font-medium">₹{course.fees.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Students:</span>
                  <span className="font-medium">{course._count?.students || 0}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Subjects:</p>
                <div className="flex flex-wrap gap-1">
                  {course.subjects.slice(0, 3).map((subject, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                  {course.subjects.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{course.subjects.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CourseManagement;
