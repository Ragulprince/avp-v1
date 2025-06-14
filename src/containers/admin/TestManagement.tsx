
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Clock, Users, MoreHorizontal, Calendar, Target, BookOpen, Edit, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TestManagement = () => {
  const { toast } = useToast();

  // Mock data
  const courses = [
    { id: 1, name: 'NEET 2024' },
    { id: 2, name: 'JEE Main 2024' },
    { id: 3, name: 'NEET 2025' }
  ];

  const subjects = [
    { id: 1, name: 'Physics', courseId: 1 },
    { id: 2, name: 'Chemistry', courseId: 1 },
    { id: 3, name: 'Biology', courseId: 1 },
    { id: 4, name: 'Mathematics', courseId: 2 }
  ];

  const batches = [
    { id: 1, name: 'Morning Batch A', courseId: 1 },
    { id: 2, name: 'Evening Batch B', courseId: 1 },
    { id: 3, name: 'Weekend Batch', courseId: 2 }
  ];

  const [tests, setTests] = useState([
    { 
      id: 1, 
      title: 'Physics Mock Test - Laws of Motion', 
      type: 'Mock Test',
      courseId: 1,
      course: 'NEET 2024',
      subjectId: 1,
      subject: 'Physics',
      batchIds: [1, 2],
      batches: ['Morning Batch A', 'Evening Batch B'],
      questions: 50, 
      duration: 90, 
      attempts: 245, 
      status: 'Active',
      scheduledDate: '2024-01-25',
      maxMarks: 200,
      isCommon: false
    },
    { 
      id: 2, 
      title: 'Chemistry Daily Quiz', 
      type: 'Daily Test',
      courseId: 1,
      course: 'NEET 2024',
      subjectId: 2,
      subject: 'Chemistry',
      batchIds: [1],
      batches: ['Morning Batch A'],
      questions: 20, 
      duration: 30, 
      attempts: 156, 
      status: 'Active',
      scheduledDate: '2024-01-20',
      maxMarks: 80,
      isCommon: false
    },
    { 
      id: 3, 
      title: 'Full Syllabus Mock Test', 
      type: 'Mock Test',
      courseId: 0,
      course: 'All Courses',
      subjectId: 0,
      subject: 'All Subjects',
      batchIds: [],
      batches: [],
      questions: 180, 
      duration: 180, 
      attempts: 89, 
      status: 'Draft',
      scheduledDate: '2024-02-01',
      maxMarks: 720,
      isCommon: true
    }
  ]);

  const [newTest, setNewTest] = useState({
    title: '',
    type: 'Mock Test',
    courseId: '',
    subjectId: '',
    batchIds: [],
    questions: '',
    duration: '',
    maxMarks: '',
    scheduledDate: '',
    description: '',
    isCommon: false
  });

  const [filters, setFilters] = useState({
    search: '',
    course: 'all',
    subject: 'all',
    type: 'all',
    status: 'all'
  });

  const handleCreateTest = () => {
    if (!newTest.title || !newTest.questions || !newTest.duration || !newTest.maxMarks) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    if (!newTest.isCommon && (!newTest.courseId || !newTest.subjectId)) {
      toast({ title: "Error", description: "Please select course and subject for specific tests.", variant: "destructive" });
      return;
    }

    const selectedCourse = courses.find(c => c.id === parseInt(newTest.courseId));
    const selectedSubject = subjects.find(s => s.id === parseInt(newTest.subjectId));
    const selectedBatches = batches.filter(b => newTest.batchIds.includes(b.id));

    const test = {
      id: tests.length + 1,
      title: newTest.title,
      type: newTest.type,
      courseId: newTest.isCommon ? 0 : parseInt(newTest.courseId),
      course: newTest.isCommon ? 'All Courses' : selectedCourse?.name || '',
      subjectId: newTest.isCommon ? 0 : parseInt(newTest.subjectId),
      subject: newTest.isCommon ? 'All Subjects' : selectedSubject?.name || '',
      batchIds: newTest.isCommon ? [] : newTest.batchIds,
      batches: newTest.isCommon ? [] : selectedBatches.map(b => b.name),
      questions: parseInt(newTest.questions),
      duration: parseInt(newTest.duration),
      maxMarks: parseInt(newTest.maxMarks),
      attempts: 0,
      status: 'Draft',
      scheduledDate: newTest.scheduledDate,
      isCommon: newTest.isCommon
    };

    setTests([...tests, test]);
    setNewTest({
      title: '',
      type: 'Mock Test',
      courseId: '',
      subjectId: '',
      batchIds: [],
      questions: '',
      duration: '',
      maxMarks: '',
      scheduledDate: '',
      description: '',
      isCommon: false
    });
    toast({ title: "Success", description: "Test created successfully!" });
  };

  const getFilteredSubjects = () => {
    if (!newTest.courseId || newTest.isCommon) return [];
    return subjects.filter(s => s.courseId === parseInt(newTest.courseId));
  };

  const getFilteredBatches = () => {
    if (!newTest.courseId || newTest.isCommon) return [];
    return batches.filter(b => b.courseId === parseInt(newTest.courseId));
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCourse = filters.course === 'all' || test.courseId === parseInt(filters.course) || (filters.course === '0' && test.isCommon);
    const matchesSubject = filters.subject === 'all' || test.subjectId === parseInt(filters.subject);
    const matchesType = filters.type === 'all' || test.type === filters.type;
    const matchesStatus = filters.status === 'all' || test.status === filters.status;
    
    return matchesSearch && matchesCourse && matchesSubject && matchesType && matchesStatus;
  });

  const getTypeColor = (type) => {
    switch (type) {
      case 'Mock Test': return 'bg-blue-100 text-blue-800';
      case 'Daily Test': return 'bg-green-100 text-green-800';
      case 'Weekly Test': return 'bg-purple-100 text-purple-800';
      case 'Monthly Test': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Test Management
            </h1>
            <p className="text-gray-600 mt-2">Create and manage quizzes, mock tests, and assessments</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <Target className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-blue-800">{tests.filter(t => t.status === 'Active').length} Active</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <Users className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-green-800">{tests.reduce((sum, t) => sum + t.attempts, 0)} Attempts</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg text-center">
              <Clock className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-purple-800">{tests.filter(t => t.status === 'Draft').length} Drafts</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white shadow-md">
          <TabsTrigger value="create" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">Create Test</TabsTrigger>
          <TabsTrigger value="manage" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">Manage Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-r from-indigo-50 to-indigo-100">
            <CardHeader className="bg-indigo-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Create New Test
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Common Test Toggle */}
              <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <input
                  type="checkbox"
                  id="commonTest"
                  checked={newTest.isCommon}
                  onChange={(e) => setNewTest({
                    ...newTest, 
                    isCommon: e.target.checked,
                    courseId: e.target.checked ? '' : newTest.courseId,
                    subjectId: e.target.checked ? '' : newTest.subjectId,
                    batchIds: e.target.checked ? [] : newTest.batchIds
                  })}
                  className="rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500"
                />
                <label htmlFor="commonTest" className="text-yellow-800 font-medium">
                  Create Common Test (for all batches and courses)
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="testTitle" className="text-indigo-700 font-medium">Test Title *</Label>
                  <Input
                    id="testTitle"
                    value={newTest.title}
                    onChange={(e) => setNewTest({...newTest, title: e.target.value})}
                    placeholder="e.g., Physics Mock Test - Laws of Motion"
                    className="border-indigo-200 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <Label htmlFor="testType" className="text-indigo-700 font-medium">Test Type *</Label>
                  <Select value={newTest.type} onValueChange={(value) => setNewTest({...newTest, type: value})}>
                    <SelectTrigger className="border-indigo-200 focus:border-indigo-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mock Test">Mock Test</SelectItem>
                      <SelectItem value="Daily Test">Daily Test</SelectItem>
                      <SelectItem value="Weekly Test">Weekly Test</SelectItem>
                      <SelectItem value="Monthly Test">Monthly Test</SelectItem>
                      <SelectItem value="Practice Test">Practice Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {!newTest.isCommon && (
                  <>
                    <div>
                      <Label htmlFor="testCourse" className="text-indigo-700 font-medium">Course *</Label>
                      <Select 
                        value={newTest.courseId} 
                        onValueChange={(value) => setNewTest({...newTest, courseId: value, subjectId: '', batchIds: []})}
                      >
                        <SelectTrigger className="border-indigo-200 focus:border-indigo-500">
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
                      <Label htmlFor="testSubject" className="text-indigo-700 font-medium">Subject *</Label>
                      <Select 
                        value={newTest.subjectId} 
                        onValueChange={(value) => setNewTest({...newTest, subjectId: value})}
                        disabled={!newTest.courseId}
                      >
                        <SelectTrigger className="border-indigo-200 focus:border-indigo-500">
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {getFilteredSubjects().map((subject) => (
                            <SelectItem key={subject.id} value={subject.id.toString()}>
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="testQuestions" className="text-indigo-700 font-medium">Number of Questions *</Label>
                  <Input
                    id="testQuestions"
                    type="number"
                    value={newTest.questions}
                    onChange={(e) => setNewTest({...newTest, questions: e.target.value})}
                    placeholder="50"
                    className="border-indigo-200 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <Label htmlFor="testDuration" className="text-indigo-700 font-medium">Duration (minutes) *</Label>
                  <Input
                    id="testDuration"
                    type="number"
                    value={newTest.duration}
                    onChange={(e) => setNewTest({...newTest, duration: e.target.value})}
                    placeholder="90"
                    className="border-indigo-200 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <Label htmlFor="testMarks" className="text-indigo-700 font-medium">Max Marks *</Label>
                  <Input
                    id="testMarks"
                    type="number"
                    value={newTest.maxMarks}
                    onChange={(e) => setNewTest({...newTest, maxMarks: e.target.value})}
                    placeholder="200"
                    className="border-indigo-200 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <Label htmlFor="testDate" className="text-indigo-700 font-medium">Scheduled Date</Label>
                  <Input
                    id="testDate"
                    type="date"
                    value={newTest.scheduledDate}
                    onChange={(e) => setNewTest({...newTest, scheduledDate: e.target.value})}
                    className="border-indigo-200 focus:border-indigo-500"
                  />
                </div>
              </div>

              {!newTest.isCommon && (
                <div>
                  <Label className="text-indigo-700 font-medium">Target Batches</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                    {getFilteredBatches().map((batch) => (
                      <div key={batch.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`test-batch-${batch.id}`}
                          checked={newTest.batchIds.includes(batch.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewTest({...newTest, batchIds: [...newTest.batchIds, batch.id]});
                            } else {
                              setNewTest({...newTest, batchIds: newTest.batchIds.filter(id => id !== batch.id)});
                            }
                          }}
                          className="rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor={`test-batch-${batch.id}`} className="text-sm text-gray-700">
                          {batch.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="testDescription" className="text-indigo-700 font-medium">Description</Label>
                <Textarea
                  id="testDescription"
                  value={newTest.description}
                  onChange={(e) => setNewTest({...newTest, description: e.target.value})}
                  placeholder="Describe the test objectives and instructions..."
                  rows={3}
                  className="border-indigo-200 focus:border-indigo-500"
                />
              </div>

              <Button onClick={handleCreateTest} className="w-full bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Test
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          {/* Filters */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search tests..."
                      value={filters.search}
                      onChange={(e) => setFilters({...filters, search: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Select value={filters.course} onValueChange={(value) => setFilters({...filters, course: value})}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      <SelectItem value="0">Common Tests</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Mock Test">Mock Test</SelectItem>
                      <SelectItem value="Daily Test">Daily Test</SelectItem>
                      <SelectItem value="Weekly Test">Weekly Test</SelectItem>
                      <SelectItem value="Monthly Test">Monthly Test</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tests List */}
          <div className="grid gap-4">
            {filteredTests.map((test) => (
              <Card key={test.id} className="shadow-lg border-0 overflow-hidden hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{test.title}</h3>
                        {test.isCommon && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Common Test
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={getTypeColor(test.type)}>{test.type}</Badge>
                        <Badge variant="outline">{test.course}</Badge>
                        {!test.isCommon && <Badge variant="outline">{test.subject}</Badge>}
                        <Badge variant={test.status === 'Active' ? 'default' : 'secondary'}>
                          {test.status}
                        </Badge>
                      </div>
                      {!test.isCommon && test.batches.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {test.batches.map((batch, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              {batch}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
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
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <BookOpen className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Questions</p>
                      <p className="font-bold text-blue-600">{test.questions}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Clock className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Duration</p>
                      <p className="font-bold text-green-600">{test.duration}m</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <Target className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Max Marks</p>
                      <p className="font-bold text-purple-600">{test.maxMarks}</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <Users className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Attempts</p>
                      <p className="font-bold text-orange-600">{test.attempts}</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-red-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Scheduled</p>
                      <p className="font-bold text-red-600 text-xs">{test.scheduledDate}</p>
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

export default TestManagement;
