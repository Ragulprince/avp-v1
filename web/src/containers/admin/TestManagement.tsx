import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash2, Play, Pause, Clock, Users, BarChart3, FileText } from 'lucide-react';

// Mock hooks (replace with actual API hooks)
interface Test {
  id: number;
  title: string;
  subject: string;
  courseId: number;
  status: string;
  description?: string;
  duration: number;
  totalMarks: number;
  _count?: { questions: number; attempts: number };
  scheduledAt?: string;
}

interface Course {
  id: number;
  name: string;
}

interface TestsResponse {
  data: Test[];
}

interface CoursesResponse {
  data: Course[];
}

// Mock useTests hook
const useTests = () => {
  return {
    data: {
      data: [
        {
          id: 1,
          title: 'Physics Monthly Test',
          subject: 'Physics',
          courseId: 1,
          status: 'ACTIVE',
          description: 'Monthly physics assessment',
          duration: 60,
          totalMarks: 100,
          _count: { questions: 20, attempts: 50 },
          scheduledAt: '2025-06-20T10:00:00Z',
        },
      ],
    } as TestsResponse,
    isLoading: false,
  };
};

// Mock useCourses hook
const useCourses = () => {
  return {
    data: {
      data: [
        { id: 1, name: 'Physics 101' },
        { id: 2, name: 'Chemistry 101' },
      ],
    } as CoursesResponse,
  };
};

// Mock useToast hook
const useToast = () => ({
  toast: ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
    console.log(`Toast: ${title} - ${description} (${variant})`);
  },
});

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-600">
          <h2>Something went wrong.</h2>
          <p>Please try refreshing the page or contact support.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

interface NewTest {
  title: string;
  description: string;
  subject_id: string;
  course_id: string;
  type: string;
  time_limit_minutes: number;
  total_marks: number;
  passing_marks: number;
  has_negative_marking: boolean;
  negative_marks: number;
  is_published: boolean;
  scheduled_at: string;
  expires_at: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

const TestManagement: React.FC = () => {
  const { toast } = useToast();
  const { data: testsResponse, isLoading } = useTests();
  const { data: coursesResponse } = useCourses();

  const tests = testsResponse?.data || [];
  const courses = coursesResponse?.data || [];

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);

  const [newTest, setNewTest] = useState<NewTest>({
    title: '',
    description: '',
    subject_id: '',
    course_id: '',
    type: 'PRACTICE',
    time_limit_minutes: 60,
    total_marks: 100,
    passing_marks: 40,
    has_negative_marking: false,
    negative_marks: 0,
    is_published: false,
    scheduled_at: '',
    expires_at: '',
    start_time: '',
    end_time: '',
    is_active: true,
  });

  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const matchesSearch =
        test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.subject?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || test.status === selectedStatus;
      const matchesCourse = selectedCourse === 'all' || test.courseId === parseInt(selectedCourse);
      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [tests, searchTerm, selectedStatus, selectedCourse]);

  const handleCreateTest = async () => {
    if (!newTest.title || !newTest.subject_id || !newTest.course_id) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }
    try {
      const payload = {
        ...newTest,
        subject_id: parseInt(newTest.subject_id),
        course_id: parseInt(newTest.course_id),
        time_limit_minutes: parseInt(String(newTest.time_limit_minutes)),
        total_marks: parseInt(String(newTest.total_marks)),
        passing_marks: parseInt(String(newTest.passing_marks)),
        negative_marks: parseFloat(String(newTest.negative_marks)),
        scheduled_at: newTest.scheduled_at ? new Date(newTest.scheduled_at).toISOString() : null,
        expires_at: newTest.expires_at ? new Date(newTest.expires_at).toISOString() : null,
        start_time: newTest.start_time ? new Date(newTest.start_time).toISOString() : null,
        end_time: newTest.end_time ? new Date(newTest.end_time).toISOString() : null,
      };
      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Failed to create test');
      }
      toast({
        title: 'Success',
        description: 'Test created successfully',
      });
      setIsCreateDialogOpen(false);
      setNewTest({
        title: '',
        description: '',
        subject_id: '',
        course_id: '',
        type: 'PRACTICE',
        time_limit_minutes: 60,
        total_marks: 100,
        passing_marks: 40,
        has_negative_marking: false,
        negative_marks: 0,
        is_published: false,
        scheduled_at: '',
        expires_at: '',
        start_time: '',
        end_time: '',
        is_active: true,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create test',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'PUBLISHED':
        return 'bg-blue-100 text-blue-800';
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string): JSX.Element => {
    switch (status) {
      case 'ACTIVE':
        return <Play className="w-4 h-4" />;
      case 'COMPLETED':
        return <Pause className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const subjects = ['Physics', 'Chemistry', 'Biology', 'Mathematics'];
  const testStatuses = ['DRAFT', 'PUBLISHED', 'ACTIVE', 'COMPLETED', 'CANCELLED'];

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
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Test Management</h1>
            <p className="text-gray-600 mt-1">Create and manage tests and quizzes</p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Test
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Test</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Test Title *</Label>
                    <Input
                      id="title"
                      value={newTest.title}
                      onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                      placeholder="Monthly Test - Physics"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject_id">Subject *</Label>
                    <Select
                      value={newTest.subject_id}
                      onValueChange={(value) => setNewTest({ ...newTest, subject_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject, idx) => (
                          <SelectItem key={idx} value={String(idx + 1)}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="course_id">Course *</Label>
                    <Select
                      value={newTest.course_id}
                      onValueChange={(value) => setNewTest({ ...newTest, course_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses
                          .filter((course) => course.id !== undefined && course.id !== null)
                          .map((course) => (
                            <SelectItem key={course.id} value={course.id.toString()}>
                              {course.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="time_limit_minutes">Duration (minutes) *</Label>
                    <Input
                      id="time_limit_minutes"
                      type="number"
                      value={newTest.time_limit_minutes}
                      onChange={(e) => setNewTest({ ...newTest, time_limit_minutes: parseInt(e.target.value) })}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="total_marks">Total Marks *</Label>
                    <Input
                      id="total_marks"
                      type="number"
                      value={newTest.total_marks}
                      onChange={(e) => setNewTest({ ...newTest, total_marks: parseInt(e.target.value) })}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="passing_marks">Passing Marks *</Label>
                    <Input
                      id="passing_marks"
                      type="number"
                      value={newTest.passing_marks}
                      onChange={(e) => setNewTest({ ...newTest, passing_marks: parseInt(e.target.value) })}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Test Type *</Label>
                    <Select value={newTest.type} onValueChange={(value) => setNewTest({ ...newTest, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {['PRACTICE', 'MOCK', 'DAILY', 'SUBJECT_WISE', 'CUSTOM', 'FINAL'].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="scheduled_at">Scheduled Date & Time</Label>
                    <Input
                      id="scheduled_at"
                      type="datetime-local"
                      value={newTest.scheduled_at}
                      onChange={(e) => setNewTest({ ...newTest, scheduled_at: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="has_negative_marking">Negative Marking?</Label>
                    <Select
                      value={newTest.has_negative_marking ? 'yes' : 'no'}
                      onValueChange={(v) =>
                        setNewTest({
                          ...newTest,
                          has_negative_marking: v === 'yes',
                          negative_marks: v === 'yes' ? newTest.negative_marks : 0,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Negative marking?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newTest.has_negative_marking && (
                    <div>
                      <Label htmlFor="negative_marks">Negative Marks</Label>
                      <Input
                        id="negative_marks"
                        type="number"
                        value={newTest.negative_marks}
                        onChange={(e) => setNewTest({ ...newTest, negative_marks: parseFloat(e.target.value) })}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="is_published">Publish?</Label>
                    <Select
                      value={newTest.is_published ? 'yes' : 'no'}
                      onValueChange={(v) => setNewTest({ ...newTest, is_published: v === 'yes' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Publish?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTest.description}
                    onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
                    placeholder="Test description..."
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTest}>Create Test</Button>
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
                  <p className="text-sm font-medium text-gray-600">Total Tests</p>
                  <p className="text-2xl font-bold">{tests.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Tests</p>
                  <p className="text-2xl font-bold">{tests.filter((t) => t.status === 'ACTIVE').length}</p>
                </div>
                <Play className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">{tests.filter((t) => t.status === 'COMPLETED').length}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Attempts</p>
                  <p className="text-2xl font-bold">
                    {tests.reduce((sum, t) => sum + (t._count?.attempts || 0), 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {testStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="All courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All courses</SelectItem>
                  {courses
                    .filter((course) => course.id !== undefined && course.id !== null)
                    .map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('all');
                  setSelectedCourse('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <Card key={test.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{test.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(test.status)}>
                          <span className="flex items-center space-x-1">
                            {getStatusIcon(test.status)}
                            <span>{test.status}</span>
                          </span>
                        </Badge>
                      </div>
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
                  {test.description || 'No description available'}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subject:</span>
                    <span className="font-medium">{test.subject}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {test.duration} min
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Marks:</span>
                    <span className="font-medium">{test.totalMarks}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Questions:</span>
                    <span className="font-medium">{test._count?.questions || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Attempts:</span>
                    <span className="font-medium">{test._count?.attempts || 0}</span>
                  </div>
                </div>

                {test.scheduledAt && (
                  <div className="text-sm text-gray-500 mb-4">
                    <strong>Scheduled:</strong> {new Date(test.scheduledAt).toLocaleString()}
                  </div>
                )}

                <div className="flex space-x-2">
                  {test.status === 'DRAFT' && (
                    <Button size="sm" variant="outline" className="flex-1">
                      Publish
                    </Button>
                  )}
                  {test.status === 'PUBLISHED' && (
                    <Button size="sm" className="flex-1">
                      Start Test
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    View Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTests.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tests found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or create your first test.</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Test
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default TestManagement;