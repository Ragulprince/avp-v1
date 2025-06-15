
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText, Search, Filter, TrendingUp, Users, Target, Clock, Eye } from 'lucide-react';

const TestReports = () => {
  const [selectedTest, setSelectedTest] = useState('all');
  const [dateRange, setDateRange] = useState('month');

  // Mock data for reports
  const completedTests = [
    {
      id: 1,
      title: 'Physics Mock Test - Laws of Motion',
      date: '2024-01-20',
      participants: 85,
      averageScore: 78.5,
      passRate: 72,
      duration: 90,
      totalQuestions: 50,
      maxScore: 195,
      minScore: 45,
      course: 'NEET 2024',
      subject: 'Physics'
    },
    {
      id: 2,
      title: 'Chemistry Daily Quiz',
      date: '2024-01-19',
      participants: 92,
      averageScore: 82.3,
      passRate: 84,
      duration: 30,
      totalQuestions: 20,
      maxScore: 100,
      minScore: 35,
      course: 'NEET 2024',
      subject: 'Chemistry'
    },
    {
      id: 3,
      title: 'Mathematics Weekly Test',
      date: '2024-01-18',
      participants: 78,
      averageScore: 75.2,
      passRate: 68,
      duration: 120,
      totalQuestions: 60,
      maxScore: 285,
      minScore: 58,
      course: 'JEE Main 2024',
      subject: 'Mathematics'
    },
    {
      id: 4,
      title: 'Biology Mock Test',
      date: '2024-01-17',
      participants: 67,
      averageScore: 69.8,
      passRate: 65,
      duration: 75,
      totalQuestions: 40,
      maxScore: 158,
      minScore: 28,
      course: 'NEET 2024',
      subject: 'Biology'
    }
  ];

  const studentResults = [
    { id: 1, name: 'Amit Sharma', testId: 1, score: 185, percentage: 92.5, rank: 1, timeTaken: 85 },
    { id: 2, name: 'Priya Patel', testId: 1, score: 178, percentage: 89.0, rank: 2, timeTaken: 88 },
    { id: 3, name: 'Rohit Kumar', testId: 1, score: 165, percentage: 82.5, rank: 3, timeTaken: 90 },
    { id: 4, name: 'Sneha Singh', testId: 1, score: 158, percentage: 79.0, rank: 4, timeTaken: 87 },
    { id: 5, name: 'Arjun Mehta', testId: 1, score: 152, percentage: 76.0, rank: 5, timeTaken: 89 }
  ];

  const scoreDistribution = [
    { range: '90-100', count: 15, percentage: 18 },
    { range: '80-89', count: 25, percentage: 30 },
    { range: '70-79', count: 20, percentage: 24 },
    { range: '60-69', count: 15, percentage: 18 },
    { range: '50-59', count: 8, percentage: 10 }
  ];

  const questionAnalysis = [
    { question: 'Q1', correct: 85, incorrect: 15, difficulty: 'Easy', topic: 'Newton\'s First Law' },
    { question: 'Q2', correct: 72, incorrect: 28, difficulty: 'Medium', topic: 'Force and Acceleration' },
    { question: 'Q3', correct: 45, incorrect: 55, difficulty: 'Hard', topic: 'Momentum Conservation' },
    { question: 'Q4', correct: 78, incorrect: 22, difficulty: 'Medium', topic: 'Friction' },
    { question: 'Q5', correct: 92, incorrect: 8, difficulty: 'Easy', topic: 'Weight and Mass' }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const getStatusBadge = (passRate) => {
    if (passRate >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (passRate >= 65) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Test Reports</h1>
          <p className="text-gray-600">Analyze test performance and generate detailed reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search tests..." className="pl-10" />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={selectedTest} onValueChange={setSelectedTest}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Test" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tests</SelectItem>
                  {completedTests.map((test) => (
                    <SelectItem key={test.id} value={test.id.toString()}>
                      {test.title.substring(0, 30)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(completedTests.reduce((sum, test) => sum + test.averageScore, 0) / completedTests.length)}%
                </div>
                <p className="text-sm text-gray-600">Avg Score</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {completedTests.reduce((sum, test) => sum + test.participants, 0)}
                </div>
                <p className="text-sm text-gray-600">Total Participants</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(completedTests.reduce((sum, test) => sum + test.passRate, 0) / completedTests.length)}%
                </div>
                <p className="text-sm text-gray-600">Pass Rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{completedTests.length}</div>
                <p className="text-sm text-gray-600">Tests Completed</p>
              </CardContent>
            </Card>
          </div>

          {/* Tests Report Table */}
          <Card>
            <CardHeader>
              <CardTitle>Completed Tests Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test Name</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center">Participants</TableHead>
                      <TableHead className="text-center">Avg Score</TableHead>
                      <TableHead className="text-center">Pass Rate</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedTests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-semibold">{test.title}</p>
                            <p className="text-sm text-gray-500">{test.totalQuestions} questions • {test.duration} min</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{test.course}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{test.subject}</Badge>
                        </TableCell>
                        <TableCell>{test.date}</TableCell>
                        <TableCell className="text-center">{test.participants}</TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold text-blue-600">{test.averageScore}%</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold text-green-600">{test.passRate}%</span>
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(test.passRate)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pass Rate by Score Range</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={scoreDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ range, percentage }) => `${range}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {scoreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Question-wise Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Topic</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead className="text-center">Correct %</TableHead>
                      <TableHead className="text-center">Incorrect %</TableHead>
                      <TableHead className="text-center">Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questionAnalysis.map((question, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{question.question}</TableCell>
                        <TableCell>{question.topic}</TableCell>
                        <TableCell>
                          <Badge variant={
                            question.difficulty === 'Easy' ? 'default' :
                            question.difficulty === 'Medium' ? 'secondary' : 'destructive'
                          }>
                            {question.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold text-green-600">{question.correct}%</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold text-red-600">{question.incorrect}%</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${question.correct}%` }}
                            ></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Performance Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead className="text-center">Score</TableHead>
                      <TableHead className="text-center">Percentage</TableHead>
                      <TableHead className="text-center">Time Taken</TableHead>
                      <TableHead className="text-center">Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentResults.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="text-center">
                          <Badge variant={student.rank <= 3 ? 'default' : 'secondary'}>
                            #{student.rank}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell className="text-center font-semibold">{student.score}</TableCell>
                        <TableCell className="text-center">
                          <span className={`font-semibold ${
                            student.percentage >= 80 ? 'text-green-600' : 
                            student.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {student.percentage}%
                          </span>
                        </TableCell>
                        <TableCell className="text-center">{student.timeTaken} min</TableCell>
                        <TableCell className="text-center">
                          {student.percentage >= 80 ? (
                            <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                          ) : student.percentage >= 60 ? (
                            <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">Poor</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestReports;
