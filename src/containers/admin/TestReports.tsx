
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText, Search, Filter, TrendingUp, Users, Target, Clock } from 'lucide-react';

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
      totalQuestions: 50
    },
    {
      id: 2,
      title: 'Chemistry Daily Quiz',
      date: '2024-01-19',
      participants: 92,
      averageScore: 82.3,
      passRate: 84,
      duration: 30,
      totalQuestions: 20
    },
    {
      id: 3,
      title: 'Mathematics Weekly Test',
      date: '2024-01-18',
      participants: 78,
      averageScore: 75.2,
      passRate: 68,
      duration: 120,
      totalQuestions: 60
    }
  ];

  const scoreDistribution = [
    { range: '90-100', count: 15, percentage: 18 },
    { range: '80-89', count: 25, percentage: 30 },
    { range: '70-79', count: 20, percentage: 24 },
    { range: '60-69', count: 15, percentage: 18 },
    { range: '50-59', count: 8, percentage: 10 }
  ];

  const questionAnalysis = [
    { question: 'Q1', correct: 85, incorrect: 15, difficulty: 'Easy' },
    { question: 'Q2', correct: 72, incorrect: 28, difficulty: 'Medium' },
    { question: 'Q3', correct: 45, incorrect: 55, difficulty: 'Hard' },
    { question: 'Q4', correct: 78, incorrect: 22, difficulty: 'Medium' },
    { question: 'Q5', correct: 92, incorrect: 8, difficulty: 'Easy' }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Test Reports</h1>
          <p className="text-gray-600">Analyze test performance and generate reports</p>
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
                  {completedTests.reduce((sum, test) => sum + test.averageScore, 0) / completedTests.length}%
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

          {/* Test List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Completed Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedTests.map((test) => (
                  <div key={test.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{test.title}</h3>
                      <p className="text-sm text-gray-600">
                        {test.date} • {test.participants} participants • {test.totalQuestions} questions
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 lg:mt-0">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{test.averageScore}%</div>
                        <div className="text-xs text-gray-500">Avg Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{test.passRate}%</div>
                        <div className="text-xs text-gray-500">Pass Rate</div>
                      </div>
                      <Button variant="outline" size="sm">View Report</Button>
                    </div>
                  </div>
                ))}
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
              <div className="space-y-4">
                {questionAnalysis.map((question, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{question.question}</span>
                      <Badge variant={
                        question.difficulty === 'Easy' ? 'default' :
                        question.difficulty === 'Medium' ? 'secondary' : 'destructive'
                      }>
                        {question.difficulty}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Correct: {question.correct}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${question.correct}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Incorrect: {question.incorrect}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${question.incorrect}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Student-wise detailed reports will be available here</p>
                <Button className="mt-4">Generate Student Reports</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestReports;
