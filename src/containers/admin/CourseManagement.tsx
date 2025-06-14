
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BookOpen, Users, Calendar, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CourseManagement = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState([
    { id: 1, name: 'NEET 2024', subjects: ['Physics', 'Chemistry', 'Biology'], students: 150, status: 'Active' },
    { id: 2, name: 'JEE Main 2024', subjects: ['Physics', 'Chemistry', 'Mathematics'], students: 120, status: 'Active' },
    { id: 3, name: 'NEET 2025', subjects: ['Physics', 'Chemistry', 'Biology'], students: 89, status: 'Draft' }
  ]);

  const [batches, setBatches] = useState([
    { id: 1, name: 'Morning Batch A', course: 'NEET 2024', timing: '6:00 AM - 12:00 PM', students: 50, capacity: 60 },
    { id: 2, name: 'Evening Batch B', course: 'NEET 2024', timing: '2:00 PM - 8:00 PM', students: 45, capacity: 50 },
    { id: 3, name: 'Weekend Batch', course: 'JEE Main 2024', timing: '9:00 AM - 6:00 PM', students: 30, capacity: 40 }
  ]);

  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Physics', chapters: 25, videos: 150, tests: 30 },
    { id: 2, name: 'Chemistry', chapters: 30, videos: 180, tests: 35 },
    { id: 3, name: 'Biology', chapters: 35, videos: 200, tests: 40 },
    { id: 4, name: 'Mathematics', chapters: 28, videos: 160, tests: 32 }
  ]);

  const [newCourse, setNewCourse] = useState({ name: '', subjects: '', description: '' });
  const [newBatch, setNewBatch] = useState({ name: '', course: '', timing: '', capacity: '' });
  const [newSubject, setNewSubject] = useState({ name: '', description: '', chapters: '' });

  const handleCreateCourse = () => {
    const course = {
      id: courses.length + 1,
      name: newCourse.name,
      subjects: newCourse.subjects.split(',').map(s => s.trim()),
      students: 0,
      status: 'Draft'
    };
    setCourses([...courses, course]);
    setNewCourse({ name: '', subjects: '', description: '' });
    toast({ title: "Course Created", description: "New course has been successfully created." });
  };

  const handleCreateBatch = () => {
    const batch = {
      id: batches.length + 1,
      name: newBatch.name,
      course: newBatch.course,
      timing: newBatch.timing,
      students: 0,
      capacity: parseInt(newBatch.capacity)
    };
    setBatches([...batches, batch]);
    setNewBatch({ name: '', course: '', timing: '', capacity: '' });
    toast({ title: "Batch Created", description: "New batch has been successfully created." });
  };

  const handleCreateSubject = () => {
    const subject = {
      id: subjects.length + 1,
      name: newSubject.name,
      chapters: parseInt(newSubject.chapters) || 0,
      videos: 0,
      tests: 0
    };
    setSubjects([...subjects, subject]);
    setNewSubject({ name: '', description: '', chapters: '' });
    toast({ title: "Subject Created", description: "New subject has been successfully created." });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600">Manage courses, batches, and subjects</p>
        </div>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="batches">Batches</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          {/* Create Course */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Create New Course
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <Label htmlFor="courseSubjects">Subjects (comma separated)</Label>
                  <Input
                    id="courseSubjects"
                    value={newCourse.subjects}
                    onChange={(e) => setNewCourse({...newCourse, subjects: e.target.value})}
                    placeholder="Physics, Chemistry, Biology"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleCreateCourse} className="w-full">
                    Create Course
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Courses List */}
          <Card>
            <CardHeader>
              <CardTitle>All Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {courses.map((course) => (
                  <div key={course.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{course.name}</h3>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {course.subjects.map((subject) => (
                            <Badge key={subject} variant="outline">{subject}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={course.status === 'Active' ? 'default' : 'secondary'}>
                          {course.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      {course.students} students enrolled
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batches" className="space-y-4">
          {/* Create Batch */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Create New Batch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="batchName">Batch Name</Label>
                  <Input
                    id="batchName"
                    value={newBatch.name}
                    onChange={(e) => setNewBatch({...newBatch, name: e.target.value})}
                    placeholder="Morning Batch A"
                  />
                </div>
                <div>
                  <Label htmlFor="batchCourse">Course</Label>
                  <Input
                    id="batchCourse"
                    value={newBatch.course}
                    onChange={(e) => setNewBatch({...newBatch, course: e.target.value})}
                    placeholder="NEET 2024"
                  />
                </div>
                <div>
                  <Label htmlFor="batchTiming">Timing</Label>
                  <Input
                    id="batchTiming"
                    value={newBatch.timing}
                    onChange={(e) => setNewBatch({...newBatch, timing: e.target.value})}
                    placeholder="6:00 AM - 12:00 PM"
                  />
                </div>
                <div>
                  <Label htmlFor="batchCapacity">Capacity</Label>
                  <Input
                    id="batchCapacity"
                    type="number"
                    value={newBatch.capacity}
                    onChange={(e) => setNewBatch({...newBatch, capacity: e.target.value})}
                    placeholder="50"
                  />
                </div>
              </div>
              <Button onClick={handleCreateBatch}>Create Batch</Button>
            </CardContent>
          </Card>

          {/* Batches List */}
          <Card>
            <CardHeader>
              <CardTitle>All Batches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Batch Name</th>
                      <th className="text-left py-3 px-4">Course</th>
                      <th className="text-left py-3 px-4">Timing</th>
                      <th className="text-left py-3 px-4">Students</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batches.map((batch) => (
                      <tr key={batch.id} className="border-b">
                        <td className="py-3 px-4 font-medium">{batch.name}</td>
                        <td className="py-3 px-4">{batch.course}</td>
                        <td className="py-3 px-4 text-sm">{batch.timing}</td>
                        <td className="py-3 px-4">
                          <span className="text-sm">
                            {batch.students}/{batch.capacity}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
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

        <TabsContent value="subjects" className="space-y-4">
          {/* Create Subject */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Create New Subject
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="subjectName">Subject Name</Label>
                  <Input
                    id="subjectName"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                    placeholder="Physics"
                  />
                </div>
                <div>
                  <Label htmlFor="subjectChapters">Number of Chapters</Label>
                  <Input
                    id="subjectChapters"
                    type="number"
                    value={newSubject.chapters}
                    onChange={(e) => setNewSubject({...newSubject, chapters: e.target.value})}
                    placeholder="25"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleCreateSubject} className="w-full">
                    Create Subject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subjects List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <Card key={subject.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      {subject.name}
                    </span>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Chapters:</span>
                    <span className="font-medium">{subject.chapters}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Videos:</span>
                    <span className="font-medium">{subject.videos}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tests:</span>
                    <span className="font-medium">{subject.tests}</span>
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
