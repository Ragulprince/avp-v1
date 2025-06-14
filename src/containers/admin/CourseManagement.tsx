
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Users, BookOpen, Calendar, Search, Edit, Trash2, MoreHorizontal } from 'lucide-react';

const CourseManagement = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: 'NEET 2024',
      description: 'Complete preparation for NEET 2024',
      duration: '12 months',
      fees: 50000,
      status: 'Active',
      studentsEnrolled: 245,
      subjects: ['Physics', 'Chemistry', 'Biology'],
      batches: [
        { id: 1, name: 'Morning Batch A', timing: '6:00 AM - 9:00 AM', students: 85 },
        { id: 2, name: 'Evening Batch B', timing: '5:00 PM - 8:00 PM', students: 92 },
        { id: 3, name: 'Weekend Batch', timing: '9:00 AM - 6:00 PM', students: 68 }
      ]
    },
    {
      id: 2,
      name: 'JEE Main 2024',
      description: 'Complete preparation for JEE Main 2024',
      duration: '10 months',
      fees: 45000,
      status: 'Active',
      studentsEnrolled: 189,
      subjects: ['Physics', 'Chemistry', 'Mathematics'],
      batches: [
        { id: 4, name: 'Morning Batch', timing: '7:00 AM - 10:00 AM', students: 95 },
        { id: 5, name: 'Evening Batch', timing: '6:00 PM - 9:00 PM', students: 94 }
      ]
    }
  ]);

  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Physics', courseId: 1, chapters: 25, videos: 120 },
    { id: 2, name: 'Chemistry', courseId: 1, chapters: 22, videos: 98 },
    { id: 3, name: 'Biology', courseId: 1, chapters: 28, videos: 156 },
    { id: 4, name: 'Mathematics', courseId: 2, chapters: 30, videos: 134 }
  ]);

  const [newCourse, setNewCourse] = useState({
    name: '',
    description: '',
    duration: '',
    fees: '',
    subjects: []
  });

  const [newBatch, setNewBatch] = useState({
    name: '',
    timing: '',
    courseId: null,
    capacity: ''
  });

  const [activeTab, setActiveTab] = useState('courses');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);

  const handleCreateCourse = () => {
    if (!newCourse.name || !newCourse.description || !newCourse.duration || !newCourse.fees) {
      return;
    }

    const course = {
      id: courses.length + 1,
      name: newCourse.name,
      description: newCourse.description,
      duration: newCourse.duration,
      fees: parseInt(newCourse.fees),
      status: 'Draft',
      studentsEnrolled: 0,
      subjects: newCourse.subjects,
      batches: []
    };

    setCourses([...courses, course]);
    setNewCourse({ name: '', description: '', duration: '', fees: '', subjects: [] });
    setIsDialogOpen(false);
  };

  const handleCreateBatch = () => {
    if (!newBatch.name || !newBatch.timing || !newBatch.courseId || !newBatch.capacity) {
      return;
    }

    setCourses(courses.map(course => {
      if (course.id === parseInt(newBatch.courseId)) {
        return {
          ...course,
          batches: [...course.batches, {
            id: Date.now(),
            name: newBatch.name,
            timing: newBatch.timing,
            students: 0,
            capacity: parseInt(newBatch.capacity)
          }]
        };
      }
      return course;
    }));

    setNewBatch({ name: '', timing: '', courseId: null, capacity: '' });
    setIsBatchDialogOpen(false);
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Course Management
            </h1>
            <p className="text-gray-600 mt-2">Manage courses, subjects, and batches</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Course
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Course</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="courseName">Course Name</Label>
                    <Input
                      id="courseName"
                      value={newCourse.name}
                      onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                      placeholder="e.g., NEET 2025"
                    />
                  </div>
                  <div>
                    <Label htmlFor="courseDescription">Description</Label>
                    <Textarea
                      id="courseDescription"
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                      placeholder="Course description..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="courseDuration">Duration</Label>
                      <Input
                        id="courseDuration"
                        value={newCourse.duration}
                        onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                        placeholder="12 months"
                      />
                    </div>
                    <div>
                      <Label htmlFor="courseFees">Fees</Label>
                      <Input
                        id="courseFees"
                        type="number"
                        value={newCourse.fees}
                        onChange={(e) => setNewCourse({...newCourse, fees: e.target.value})}
                        placeholder="50000"
                      />
                    </div>
                  </div>
                  <Button onClick={handleCreateCourse} className="w-full">
                    Create Course
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isBatchDialogOpen} onOpenChange={setIsBatchDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Batch
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Batch</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="batchCourse">Select Course</Label>
                    <Select value={newBatch.courseId?.toString()} onValueChange={(value) => setNewBatch({...newBatch, courseId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Course" />
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
                    <Label htmlFor="batchName">Batch Name</Label>
                    <Input
                      id="batchName"
                      value={newBatch.name}
                      onChange={(e) => setNewBatch({...newBatch, name: e.target.value})}
                      placeholder="e.g., Morning Batch A"
                    />
                  </div>
                  <div>
                    <Label htmlFor="batchTiming">Timing</Label>
                    <Input
                      id="batchTiming"
                      value={newBatch.timing}
                      onChange={(e) => setNewBatch({...newBatch, timing: e.target.value})}
                      placeholder="e.g., 6:00 AM - 9:00 AM"
                    />
                  </div>
                  <div>
                    <Label htmlFor="batchCapacity">Capacity</Label>
                    <Input
                      id="batchCapacity"
                      type="number"
                      value={newBatch.capacity}
                      onChange={(e) => setNewBatch({...newBatch, capacity: e.target.value})}
                      placeholder="100"
                    />
                  </div>
                  <Button onClick={handleCreateBatch} className="w-full">
                    Create Batch
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Search */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-4">
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white shadow-md">
          <TabsTrigger value="courses" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Courses</TabsTrigger>
          <TabsTrigger value="subjects" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">Subjects</TabsTrigger>
          <TabsTrigger value="batches" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">Batches</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="grid gap-4">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="shadow-lg border-0 overflow-hidden hover:shadow-xl transition-shadow">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 sm:mb-0">{course.name}</h3>
                        <Badge variant={course.status === 'Active' ? 'default' : 'secondary'}>
                          {course.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{course.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {course.subjects.map((subject, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Students</p>
                      <p className="font-bold text-blue-600">{course.studentsEnrolled}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Duration</p>
                      <p className="font-bold text-green-600">{course.duration}</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <BookOpen className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Subjects</p>
                      <p className="font-bold text-purple-600">{course.subjects.length}</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-orange-600 font-bold text-lg">₹</span>
                      <p className="text-xs text-gray-600">Fees</p>
                      <p className="font-bold text-orange-600">{course.fees.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <div className="grid gap-4">
            {subjects.map((subject) => (
              <Card key={subject.id} className="shadow-lg border-0">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{subject.name}</h3>
                      <p className="text-gray-600 mb-3">
                        Course: {courses.find(c => c.id === subject.courseId)?.name}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 lg:gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <BookOpen className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Chapters</p>
                      <p className="font-bold text-blue-600">{subject.chapters}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Videos</p>
                      <p className="font-bold text-green-600">{subject.videos}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="batches" className="space-y-4">
          <div className="grid gap-4">
            {courses.map((course) => (
              <div key={course.id}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{course.name}</h3>
                <div className="grid gap-3">
                  {course.batches.map((batch) => (
                    <Card key={batch.id} className="shadow-md border-0">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{batch.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{batch.timing}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-2 bg-blue-50 rounded-lg">
                            <Users className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                            <p className="text-xs text-gray-600">Students</p>
                            <p className="text-sm font-bold text-blue-600">{batch.students}</p>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded-lg">
                            <Calendar className="w-4 h-4 text-green-600 mx-auto mb-1" />
                            <p className="text-xs text-gray-600">Capacity</p>
                            <p className="text-sm font-bold text-green-600">{batch.capacity || 'N/A'}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {course.batches.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No batches created for this course</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseManagement;
