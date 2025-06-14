
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Play, FileText, MoreHorizontal } from 'lucide-react';

const ContentManagement = () => {
  const content = [
    { id: 1, title: 'Physics - Newton\'s Laws', type: 'Video', subject: 'Physics', status: 'Published' },
    { id: 2, title: 'Chemistry Notes - Organic', type: 'Document', subject: 'Chemistry', status: 'Draft' },
    { id: 3, title: 'Biology - Cell Structure', type: 'Video', subject: 'Biology', status: 'Published' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600">Manage videos, documents, and study materials</p>
        </div>
        <Button>
          <Upload className="w-4 h-4 mr-2" />
          Upload Content
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Play className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">156</p>
            <p className="text-sm text-gray-600">Total Videos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">89</p>
            <p className="text-sm text-gray-600">Documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Upload className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-gray-600">Pending Review</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Title</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Subject</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {content.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3 px-4 font-medium">{item.title}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {item.type === 'Video' ? (
                          <Play className="w-4 h-4 mr-2 text-blue-600" />
                        ) : (
                          <FileText className="w-4 h-4 mr-2 text-gray-600" />
                        )}
                        {item.type}
                      </div>
                    </td>
                    <td className="py-3 px-4">{item.subject}</td>
                    <td className="py-3 px-4">
                      <Badge variant={item.status === 'Published' ? 'default' : 'secondary'}>
                        {item.status}
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

export default ContentManagement;
