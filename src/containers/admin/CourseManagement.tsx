
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, BookOpen, Users, Calendar, Edit, Trash2, GraduationCap, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CourseManagement = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState([
    { 
      id: 1, 
      name: 'NEET 2024', 
      description: 'Comprehensive NEET preparation course covering all subjects',
      subjects: ['Physics', 'Chemistry', 'Biology'], 
      students: 150, 
      status: 'Active',
      duration: '12 months',
      fees: 50000
    },
    { 
      id: 2, 
      name: 'JEE Main 2024', 
      description: 'Complete JEE Main preparation with advanced problem solving',
      subjects: ['Physics', 'Chemistry', 'Mathematics'], 
      students: 120, 
      status: 'Active',
      duration: '10 months',
      fees: 45000
    },
    { 
      id: 3, 
      name: 'NEET 2025', 
      description: 'Early preparation course for NEET 2025 aspirants',
      subjects: ['Physics', 'Chemistry', 'Biology'], 
      students: 89, 
      status: 'Draft',
      duration: '18 months',
      fees: 60000
    }
  ]);

  const [batches, setBatches] = useState([
    { id: 1, name: 'Morning Batch A', courseId: 1, courseName: 'NEET 2024', timing: '6:00 AM - 12:00 PM', students: 50, capacity: 60, startDate: '2024-01-15' },
    { id: 2, name: 'Evening Batch B', courseId: 1, courseName: 'NEET 2024', timing: '2:00 PM - 8:00 PM', students: 45, capacity: 50, startDate: '2024-01-20' },
    { id: 3, name: 'Weekend Batch', courseId: 2, courseName: 'JEE Main 2024', timing: '9:00 AM - 6:00 PM', students: 30, capacity: 40, startDate: '2024-02-01' }
  ]);

  const [subjects, setSubjects] = useState([
    { 
      id: 1, 
      name: 'Physics', 
      courseId: 1, 
      courseName: 'NEET 2024',
      chapters: 25, 
      lessons: 150,
      topics: 300,
      videos: 150, 
      tests: 30,
      description: 'Complete physics syllabus for NEET'
    },
    { 
      id: 2, 
      name: 'Chemistry', 
      courseId: 1, 
      courseName: 'NEET 2024',
      chapters: 30, 
      lessons: 180,
      topics: 360,
      videos: 180, 
      tests: 35,
      description: 'Organic, Inorganic and Physical Chemistry'
    },
    { 
      id: 3, 
      name: 'Biology', 
      courseId: 1, 
      courseName: 'NEET 2024',
      chapters: 35, 
      lessons: 200,
      topics: 400,
      videos: 200, 
      tests: 40,
      description: 'Botany and Zoology for NEET'
    },
    { 
      id: 4, 
      name: 'Mathematics', 
      courseId: 2, 
      courseName: 'JEE Main 2024',
      chapters: 28, 
      lessons: 160,
      topics: 320,
      videos: 160, 
      tests: 32,
      description: 'Advanced mathematics for JEE Main'
    }
  ]);

  const [newCourse, setNewCourse] = useState({ name: '', description: '', duration: '', fees: '', subjects: '' });
  const [newBatch, setNewBatch] = useState({ name: '', courseId: '', timing: '', capacity: '', startDate: '' });
  const [newSubject, setNewSubject] = useState({ name: '', courseId: '', description: '', chapters: '', lessons: '', topics: '' });

  const handleCreateCourse = () => {
    if (!newCourse.name || !newCourse.description) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    
    const course = {
      id: courses.length + 1,
      name: newCourse.name,
      description: newCourse.description,
      subjects: newCourse.subjects.split(',').map(s => s.trim()).filter(s => s),
      students: 0,
      status: 'Draft',
      duration: newCourse.duration,
      fees: parseInt(newCourse.fees) || 0
    };
    setCourses([...courses, course]);
    setNewCourse({ name: '', description: '', duration: '', fees: '', subjects: '' });
    toast({ title: "Success", description: "Course created successfully!" });
  };

  const handleCreateBatch = () => {
    if (!newBatch.name || !newBatch.courseId || !newBatch.timing || !newBatch.capacity) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    
    const selectedCourse = courses.find(c => c.id === parseInt(newBatch.courseId));
    const batch = {
      id: batches.length + 1,
      name: newBatch.name,
      courseId: parseInt(newBatch.courseId),
      courseName: selectedCourse?.name || '',
      timing: newBatch.timing,
      students: 0,
      capacity: parseInt(newBatch.capacity),
      startDate: newBatch.startDate
    };
    setBatches([...batches, batch]);
    setNewBatch({ name: '', courseId: '', timing: '', capacity: '', startDate: '' });
    toast({ title: "Success", description: "Batch created successfully!" });
  };

  const handleCreateSubject = () => {
    if (!newSubject.name || !newSubject.courseId || !newSubject.description) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    
    const selectedCourse = courses.find(c => c.id === parseInt(newSubject.courseId));
    const subject = {
      id: subjects.length + 1,
      name: newSubject.name,
      courseId: parseInt(newSubject.courseId),
      courseName: selectedCourse?.name || '',
      chapters: parseInt(newSubject.chapters) || 0,
      lessons: parseInt(newSubject.lessons) || 0,
      topics: parseInt(newSubject.topics) || 0,
      videos: 0,
      tests: 0,
      description: newSubject.description
    };
    setSubjects([...subjects, subject]);
    setNewSubject({ name: '', courseId: '', description: '', chapters: '', lessons: '', topics: '' });
    toast({ title: "Success", description: "Subject created successfully!" });
  };

  return (
    <div className="space-y-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Course Management
            </h1>
            <p className="text-gray-600 mt-2">Create and manage courses, batches, and subjects</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <GraduationCap className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-blue-800">{courses.length} Courses</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <Users className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-green-800">{batches.length} Batches</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg text-center">
              <BookOpen className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-purple-800">{subjects.length} Subjects</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white shadow-md">
          <TabsTrigger value="courses" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Courses</TabsTrigger>
          <TabsTrigger value="batches" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">Batches</TabsTrigger>
          <TabsTrigger value="subjects" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">Subjects</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          {/* Create Course */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-blue-100">
            <CardHeader className="bg-blue-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Create New Course
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="courseName" className="text-blue-700 font-medium">Course Name *</Label>
                  <Input
                    id="courseName"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                    placeholder="e.g., NEET 2025"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="courseDuration" className="text-blue-700 font-medium">Duration</Label>
                  <Input
                    id="courseDuration"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                    placeholder="e.g., 12 months"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="courseFees" className="text-blue-700 font-medium">Fees (₹)</Label>
                  <Input
                    id="courseFees"
                    type="number"
                    value={newCourse.fees}
                    onChange={(e) => setNewCourse({...newCourse, fees: e.target.value})}
                    placeholder="50000"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="courseSubjects" className="text-blue-700 font-medium">Initial Subjects</Label>
                  <Input
                    id="courseSubjects"
                    value={newCourse.subjects}
                    onChange={(e) => setNewCourse({...newCourse, subjects: e.target.value})}
                    placeholder="Physics, Chemistry, Biology"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="courseDescription" className="text-blue-700 font-medium">Description *</Label>
                <Textarea
                  id="courseDescription"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                  placeholder="Describe the course objectives and curriculum..."
                  rows={3}
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
              <Button onClick={handleCreateCourse} className="w-full bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Course
              </Button>
            </CardContent>
          </Card>

          {/* Courses List */}
          <div className="grid gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="shadow-lg border-0 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4">
                  <div className="flex justify-between items-start">
                    <div className="text-white">
                      <h3 className="font-bold text-xl">{course.name}</h3>
                      <p className="text-blue-100 text-sm mt-1">{course.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={course.status === 'Active' ? 'default' : 'secondary'} className="bg-white text-blue-600">
                        {course.status}
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Students</p>
                      <p className="font-bold text-blue-600">{course.students}</p>
                    </div>
                    <div className="text-center">
                      <Calendar className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-bold text-green-600">{course.duration}</p>
                    </div>
                    <div className="text-center">
                      <BookOpen className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Subjects</p>
                      <p className="font-bold text-purple-600">{course.subjects.length}</p>
                    </div>
                    <div className="text-center">
                      <FileText className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Fees</p>
                      <p className="font-bold text-orange-600">₹{course.fees?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {course.subjects.map((subject) => (
                      <Badge key={subject} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="batches" className="space-y-6">
          {/* Create Batch */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-green-100">
            <CardHeader className="bg-green-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Create New Batch
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="batchName" className="text-green-700 font-medium">Batch Name *</Label>
                  <Input
                    id="batchName"
                    value={newBatch.name}
                    onChange={(e) => setNewBatch({...newBatch, name: e.target.value})}
                    placeholder="Morning Batch A"
                    className="border-green-200 focus:border-green-500"
                  />
                </div>
                <div>
                  <Label htmlFor="batchCourse" className="text-green-700 font-medium">Course *</Label>
                  <Select value={newBatch.courseId} onValueChange={(value) => setNewBatch({...newBatch, courseId: value})}>
                    <SelectTrigger className="border-green-200 focus:border-green-500">
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
                  <Label htmlFor="batchTiming" className="text-green-700 font-medium">Timing *</Label>
                  <Input
                    id="batchTiming"
                    value={newBatch.timing}
                    onChange={(e) => setNewBatch({...newBatch, timing: e.target.value})}
                    placeholder="6:00 AM - 12:00 PM"
                    className="border-green-200 focus:border-green-500"
                  />
                </div>
                <div>
                  <Label htmlFor="batchCapacity" className="text-green-700 font-medium">Capacity *</Label>
                  <Input
                    id="batchCapacity"
                    type="number"
                    value={newBatch.capacity}
                    onChange={(e) => setNewBatch({...newBatch, capacity: e.target.value})}
                    placeholder="50"
                    className="border-green-200 focus:border-green-500"
                  />
                </div>
                <div>
                  <Label htmlFor="batchStartDate" className="text-green-700 font-medium">Start Date</Label>
                  <Input
                    id="batchStartDate"
                    type="date"
                    value={newBatch.startDate}
                    onChange={(e) => setNewBatch({...newBatch, startDate: e.target.value})}
                    className="border-green-200 focus:border-green-500"
                  />
                </div>
              </div>
              <Button onClick={handleCreateBatch} className="w-full bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Batch
              </Button>
            </CardContent>
          </Card>

          {/* Batches List */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
              <CardTitle>All Batches</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-green-700">Batch Name</th>
                      <th className="text-left py-4 px-6 font-semibold text-green-700">Course</th>
                      <th className="text-left py-4 px-6 font-semibold text-green-700">Timing</th>
                      <th className="text-left py-4 px-6 font-semibold text-green-700">Students</th>
                      <th className="text-left py-4 px-6 font-semibold text-green-700">Start Date</th>
                      <th className="text-left py-4 px-6 font-semibold text-green-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batches.map((batch, index) => (
                      <tr key={batch.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-4 px-6 font-medium text-gray-900">{batch.name}</td>
                        <td className="py-4 px-6">
                          <Badge className="bg-blue-100 text-blue-800">{batch.courseName}</Badge>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">{batch.timing}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${(batch.students / batch.capacity) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">
                              {batch.students}/{batch.capacity}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">{batch.startDate}</td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          {/* Create Subject */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-50 to-purple-100">
            <CardHeader className="bg-purple-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Create New Subject
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="subjectName" className="text-purple-700 font-medium">Subject Name *</Label>
                  <Input
                    id="subjectName"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                    placeholder="Physics"
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
                <div>
                  <Label htmlFor="subjectCourse" className="text-purple-700 font-medium">Course *</Label>
                  <Select value={newSubject.courseId} onValueChange={(value) => setNewSubject({...newSubject, courseId: value})}>
                    <SelectTrigger className="border-purple-200 focus:border-purple-500">
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
                  <Label htmlFor="subjectChapters" className="text-purple-700 font-medium">Chapters</Label>
                  <Input
                    id="subjectChapters"
                    type="number"
                    value={newSubject.chapters}
                    onChange={(e) => setNewSubject({...newSubject, chapters: e.target.value})}
                    placeholder="25"
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
                <div>
                  <Label htmlFor="subjectLessons" className="text-purple-700 font-medium">Lessons</Label>
                  <Input
                    id="subjectLessons"
                    type="number"
                    value={newSubject.lessons}
                    onChange={(e) => setNewSubject({...newSubject, lessons: e.target.value})}
                    placeholder="150"
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
                <div>
                  <Label htmlFor="subjectTopics" className="text-purple-700 font-medium">Topics</Label>
                  <Input
                    id="subjectTopics"
                    type="number"
                    value={newSubject.topics}
                    onChange={(e) => setNewSubject({...newSubject, topics: e.target.value})}
                    placeholder="300"
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="subjectDescription" className="text-purple-700 font-medium">Description *</Label>
                <Textarea
                  id="subjectDescription"
                  value={newSubject.description}
                  onChange={(e) => setNewSubject({...newSubject, description: e.target.value})}
                  placeholder="Describe the subject curriculum and objectives..."
                  rows={3}
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>
              <Button onClick={handleCreateSubject} className="w-full bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Subject
              </Button>
            </CardContent>
          </Card>

          {/* Subjects List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Card key={subject.id} className="shadow-lg border-0 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center">
                      <BookOpen className="w-6 h-6 mr-2" />
                      <div>
                        <h3 className="font-bold">{subject.name}</h3>
                        <p className="text-sm text-purple-100">{subject.courseName}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4 space-y-3">
                  <p className="text-sm text-gray-600">{subject.description}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <p className="text-xs text-gray-600">Chapters</p>
                      <p className="font-bold text-blue-600">{subject.chapters}</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <p className="text-xs text-gray-600">Lessons</p>
                      <p className="font-bold text-green-600">{subject.lessons}</p>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded">
                      <p className="text-xs text-gray-600">Topics</p>
                      <p className="font-bold text-purple-600">{subject.topics}</p>
                    </div>
                    <div className="text-center p-2 bg-orange-50 rounded">
                      <p className="text-xs text-gray-600">Videos</p>
                      <p className="font-bold text-orange-600">{subject.videos}</p>
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

export default CourseManagement;
