
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, MoreHorizontal } from 'lucide-react';

const StudentManagement = () => {
  const students = [
    { id: 1, name: 'Arjun Kumar', email: 'arjun@example.com', batch: 'NEET 2024', status: 'Active' },
    { id: 2, name: 'Priya Sharma', email: 'priya@example.com', batch: 'JEE 2024', status: 'Active' },
    { id: 3, name: 'Meera Patel', email: 'meera@example.com', batch: 'NEET 2024', status: 'Inactive' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600">Manage all registered students</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>All Students</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search students..." className="pl-10 w-full sm:w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Batch</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b">
                    <td className="py-3 px-4 font-medium">{student.name}</td>
                    <td className="py-3 px-4 text-gray-600">{student.email}</td>
                    <td className="py-3 px-4">{student.batch}</td>
                    <td className="py-3 px-4">
                      <Badge variant={student.status === 'Active' ? 'default' : 'secondary'}>
                        {student.status}
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

export default StudentManagement;
