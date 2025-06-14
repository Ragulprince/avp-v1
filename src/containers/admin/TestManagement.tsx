
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Plus, Clock, Users, MoreHorizontal, Calendar, Target, BookOpen, Edit, Trash2, Search, Settings, Database } from 'lucide-react';

const TestManagement = () => {
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

  const questionBank = [
    { id: 1, question: 'What is Newton\'s first law?', subject: 'Physics', difficulty: 'Easy' },
    { id: 2, question: 'Define photosynthesis', subject: 'Biology', difficulty: 'Medium' },
    { id: 3, question: 'Calculate the derivative of x²', subject: 'Mathematics', difficulty: 'Hard' }
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
      isCommon: false,
      settings: {
        shuffleQuestions: true,
        shuffleOptions: true,
        showImmediateResult: false,
        negativeMarks: true,
        negativeMarkValue: 0.25,
        timeLimit: true,
        allowRevisit: true,
        showCorrectAnswers: true,
        passPercentage: 40
      }
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
      isCommon: false,
      settings: {
        shuffleQuestions: false,
        shuffleOptions: true,
        showImmediateResult: true,
        negativeMarks: false,
        negativeMarkValue: 0,
        timeLimit: true,
        allowRevisit: false,
        showCorrectAnswers: true,
        passPercentage: 50
      }
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
    isCommon: false,
    questionSource: 'manual', // 'manual' or 'questionBank'
    selectedQuestions: [],
    manualQuestions: '',
    settings: {
      shuffleQuestions: true,
      shuffleOptions: true,
      showImmediateResult: false,
      negativeMarks: true,
      negativeMarkValue: 0.25,
      timeLimit: true,
      allowRevisit: true,
      showCorrectAnswers: true,
      passPercentage: 40
    }
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
      return;
    }

    if (!newTest.isCommon && (!newTest.courseId || !newTest.subjectId)) {
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
      isCommon: newTest.isCommon,
      settings: newTest.settings
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
      isCommon: false,
      questionSource: 'manual',
      selectedQuestions: [],
      manualQuestions: '',
      settings: {
        shuffleQuestions: true,
        shuffleOptions: true,
        showImmediateResult: false,
        negativeMarks: true,
        negativeMarkValue: 0.25,
        timeLimit: true,
        allowRevisit: true,
        showCorrectAnswers: true,
        passPercentage: 40
      }
    });
  };

  const getFilteredSubjects = () => {
    if (!newTest.courseId || newTest.isCommon) return [];
    return subjects.filter(s => s.courseId === parseInt(newTest.courseId));
  };

  const getFilteredBatches = () => {
    if (!newTest.courseId || newTest.isCommon) return [];
    return batches.filter(b => b.courseId === parseInt(newTest.courseId));
  };

  const getFilteredQuestions = () => {
    if (!newTest.subjectId) return [];
    return questionBank.filter(q => q.subject === subjects.find(s => s.id === parseInt(newTest.subjectId))?.name);
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
    <div className="space-y-6 p-4 lg:p-6 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Test Management
            </h1>
            <p className="text-gray-600 mt-2">Create and manage quizzes, mock tests, and assessments</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-blue-100 p-3 lg:p-4 rounded-lg text-center">
              <Target className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600 mx-auto mb-1" />
              <p className="text-xs lg:text-sm font-medium text-blue-800">{tests.filter(t => t.status === 'Active').length} Active</p>
            </div>
            <div className="bg-green-100 p-3 lg:p-4 rounded-lg text-center">
              <Users className="w-5 h-5 lg:w-6 lg:h-6 text-green-600 mx-auto mb-1" />
              <p className="text-xs lg:text-sm font-medium text-green-800">{tests.reduce((sum, t) => sum + t.attempts, 0)} Attempts</p>
            </div>
            <div className="bg-purple-100 p-3 lg:p-4 rounded-lg text-center">
              <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600 mx-auto mb-1" />
              <p className="text-xs lg:text-sm font-medium text-purple-800">{tests.filter(t => t.status === 'Draft').length} Drafts</p>
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
              <CardTitle className="flex items-center text-lg lg:text-xl">
                <Plus className="w-5 h-5 mr-2" />
                Create New Test
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 space-y-6">
              {/* Common Test Toggle */}
              <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <Switch
                  id="commonTest"
                  checked={newTest.isCommon}
                  onCheckedChange={(checked) => setNewTest({
                    ...newTest, 
                    isCommon: checked,
                    courseId: checked ? '' : newTest.courseId,
                    subjectId: checked ? '' : newTest.subjectId,
                    batchIds: checked ? [] : newTest.batchIds
                  })}
                />
                <label htmlFor="commonTest" className="text-yellow-800 font-medium">
                  Create Common Test (for all batches and courses)
                </label>
              </div>

              {/* Basic Test Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
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

              {/* Question Source Selection */}
              <div>
                <Label className="text-indigo-700 font-medium">Question Source</Label>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="manual"
                      name="questionSource"
                      value="manual"
                      checked={newTest.questionSource === 'manual'}
                      onChange={(e) => setNewTest({...newTest, questionSource: e.target.value})}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="manual" className="text-sm text-gray-700">Manual Entry</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="questionBank"
                      name="questionSource"
                      value="questionBank"
                      checked={newTest.questionSource === 'questionBank'}
                      onChange={(e) => setNewTest({...newTest, questionSource: e.target.value})}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="questionBank" className="text-sm text-gray-700">From Question Bank</label>
                  </div>
                </div>
              </div>

              {/* Question Input Based on Source */}
              {newTest.questionSource === 'manual' ? (
                <div>
                  <Label htmlFor="manualQuestions" className="text-indigo-700 font-medium">Questions</Label>
                  <Textarea
                    id="manualQuestions"
                    value={newTest.manualQuestions}
                    onChange={(e) => setNewTest({...newTest, manualQuestions: e.target.value})}
                    placeholder="Type your questions here..."
                    rows={4}
                    className="border-indigo-200 focus:border-indigo-500"
                  />
                </div>
              ) : (
                <div>
                  <Label className="text-indigo-700 font-medium">Select Questions from Bank</Label>
                  <div className="mt-2 max-h-40 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                    {getFilteredQuestions().length > 0 ? (
                      getFilteredQuestions().map((question) => (
                        <div key={question.id} className="flex items-center space-x-2 mb-2">
                          <input
                            type="checkbox"
                            id={`question-${question.id}`}
                            checked={newTest.selectedQuestions.includes(question.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewTest({...newTest, selectedQuestions: [...newTest.selectedQuestions, question.id]});
                              } else {
                                setNewTest({...newTest, selectedQuestions: newTest.selectedQuestions.filter(id => id !== question.id)});
                              }
                            }}
                            className="rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label htmlFor={`question-${question.id}`} className="text-sm text-gray-700 flex-1">
                            {question.question}
                            <Badge variant="outline" className="ml-2 text-xs">{question.difficulty}</Badge>
                          </label>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        {newTest.subjectId ? 'No questions available for this subject' : 'Select a subject to view questions'}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Test Configuration Settings */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-4">
                  <Settings className="w-5 h-5 mr-2 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Test Configuration</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="shuffleQuestions" className="text-sm font-medium">Shuffle Questions</Label>
                      <Switch
                        id="shuffleQuestions"
                        checked={newTest.settings.shuffleQuestions}
                        onCheckedChange={(checked) => setNewTest({
                          ...newTest,
                          settings: {...newTest.settings, shuffleQuestions: checked}
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="shuffleOptions" className="text-sm font-medium">Shuffle Answer Options</Label>
                      <Switch
                        id="shuffleOptions"
                        checked={newTest.settings.shuffleOptions}
                        onCheckedChange={(checked) => setNewTest({
                          ...newTest,
                          settings: {...newTest.settings, shuffleOptions: checked}
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showImmediateResult" className="text-sm font-medium">Show Immediate Result</Label>
                      <Switch
                        id="showImmediateResult"
                        checked={newTest.settings.showImmediateResult}
                        onCheckedChange={(checked) => setNewTest({
                          ...newTest,
                          settings: {...newTest.settings, showImmediateResult: checked}
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="allowRevisit" className="text-sm font-medium">Allow Question Revisit</Label>
                      <Switch
                        id="allowRevisit"
                        checked={newTest.settings.allowRevisit}
                        onCheckedChange={(checked) => setNewTest({
                          ...newTest,
                          settings: {...newTest.settings, allowRevisit: checked}
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="negativeMarks" className="text-sm font-medium">Negative Marking</Label>
                      <Switch
                        id="negativeMarks"
                        checked={newTest.settings.negativeMarks}
                        onCheckedChange={(checked) => setNewTest({
                          ...newTest,
                          settings: {...newTest.settings, negativeMarks: checked}
                        })}
                      />
                    </div>
                    
                    {newTest.settings.negativeMarks && (
                      <div>
                        <Label htmlFor="negativeMarkValue" className="text-sm font-medium">Negative Mark Value</Label>
                        <Input
                          id="negativeMarkValue"
                          type="number"
                          step="0.1"
                          value={newTest.settings.negativeMarkValue}
                          onChange={(e) => setNewTest({
                            ...newTest,
                            settings: {...newTest.settings, negativeMarkValue: parseFloat(e.target.value)}
                          })}
                          className="mt-1"
                        />
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor="passPercentage" className="text-sm font-medium">Pass Percentage</Label>
                      <Input
                        id="passPercentage"
                        type="number"
                        value={newTest.settings.passPercentage}
                        onChange={(e) => setNewTest({
                          ...newTest,
                          settings: {...newTest.settings, passPercentage: parseInt(e.target.value)}
                        })}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showCorrectAnswers" className="text-sm font-medium">Show Correct Answers After Test</Label>
                      <Switch
                        id="showCorrectAnswers"
                        checked={newTest.settings.showCorrectAnswers}
                        onCheckedChange={(checked) => setNewTest({
                          ...newTest,
                          settings: {...newTest.settings, showCorrectAnswers: checked}
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {!newTest.isCommon && (
                <div>
                  <Label className="text-indigo-700 font-medium">Target Batches</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
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

          <div className="grid gap-4">
            {filteredTests.map((test) => (
              <Card key={test.id} className="shadow-lg border-0 overflow-hidden hover:shadow-xl transition-shadow">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
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
                    <div className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
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
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 lg:gap-4">
                    <div className="text-center p-2 lg:p-3 bg-blue-50 rounded-lg">
                      <BookOpen className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Questions</p>
                      <p className="text-sm lg:text-base font-bold text-blue-600">{test.questions}</p>
                    </div>
                    <div className="text-center p-2 lg:p-3 bg-green-50 rounded-lg">
                      <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Duration</p>
                      <p className="text-sm lg:text-base font-bold text-green-600">{test.duration}m</p>
                    </div>
                    <div className="text-center p-2 lg:p-3 bg-purple-50 rounded-lg">
                      <Target className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Max Marks</p>
                      <p className="text-sm lg:text-base font-bold text-purple-600">{test.maxMarks}</p>
                    </div>
                    <div className="text-center p-2 lg:p-3 bg-orange-50 rounded-lg">
                      <Users className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Attempts</p>
                      <p className="text-sm lg:text-base font-bold text-orange-600">{test.attempts}</p>
                    </div>
                    <div className="text-center p-2 lg:p-3 bg-red-50 rounded-lg">
                      <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-red-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Scheduled</p>
                      <p className="text-xs lg:text-sm font-bold text-red-600">{test.scheduledDate}</p>
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
