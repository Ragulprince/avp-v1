
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Users, MoreHorizontal } from 'lucide-react';

const TestManagement = () => {
  const tests = [
    { id: 1, title: 'Physics Mock Test', questions: 50, duration: 90, attempts: 245, status: 'Active' },
    { id: 2, title: 'Chemistry Daily Quiz', questions: 20, duration: 30, attempts: 156, status: 'Active' },
    { id: 3, title: 'Biology Full Test', questions: 100, duration: 180, attempts: 89, status: 'Draft' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Test Management</h1>
          <p className="text-gray-600">Create and manage quizzes and mock tests</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Test
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">24</p>
            <p className="text-sm text-gray-600">Active Tests</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">1,456</p>
            <p className="text-sm text-gray-600">Total Attempts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Plus className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">89%</p>
            <p className="text-sm text-gray-600">Avg Score</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Test Name</th>
                  <th className="text-left py-3 px-4">Questions</th>
                  <th className="text-left py-3 px-4">Duration</th>
                  <th className="text-left py-3 px-4">Attempts</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test) => (
                  <tr key={test.id} className="border-b">
                    <td className="py-3 px-4 font-medium">{test.title}</td>
                    <td className="py-3 px-4">{test.questions}</td>
                    <td className="py-3 px-4">{test.duration} min</td>
                    <td className="py-3 px-4">{test.attempts}</td>
                    <td className="py-3 px-4">
                      <Badge variant={test.status === 'Active' ? 'default' : 'secondary'}>
                        {test.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestManagement;
