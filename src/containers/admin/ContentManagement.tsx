
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Play, FileText, MoreHorizontal, Video, File, Image, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContentManagement = () => {
  const { toast } = useToast();
  
  // Mock data for courses and subjects
  const courses = [
    { id: 1, name: 'NEET 2024' },
    { id: 2, name: 'JEE Main 2024' },
    { id: 3, name: 'NEET 2025' }
  ];

  const subjects = [
    { id: 1, name: 'Physics', courseId: 1, courseName: 'NEET 2024' },
    { id: 2, name: 'Chemistry', courseId: 1, courseName: 'NEET 2024' },
    { id: 3, name: 'Biology', courseId: 1, courseName: 'NEET 2024' },
    { id: 4, name: 'Mathematics', courseId: 2, courseName: 'JEE Main 2024' }
  ];

  const batches = [
    { id: 1, name: 'Morning Batch A', courseId: 1, courseName: 'NEET 2024' },
    { id: 2, name: 'Evening Batch B', courseId: 1, courseName: 'NEET 2024' },
    { id: 3, name: 'Weekend Batch', courseId: 2, courseName: 'JEE Main 2024' }
  ];

  const [content, setContent] = useState([
    { 
      id: 1, 
      title: 'Newton\'s Laws of Motion', 
      type: 'Video', 
      subjectId: 1,
      subject: 'Physics', 
      courseId: 1,
      course: 'NEET 2024',
      batchIds: [1, 2],
      batches: ['Morning Batch A', 'Evening Batch B'],
      status: 'Published',
      duration: '45 min',
      uploadDate: '2024-01-15',
      views: 1250
    },
    { 
      id: 2, 
      title: 'Organic Chemistry Notes', 
      type: 'Document', 
      subjectId: 2,
      subject: 'Chemistry', 
      courseId: 1,
      course: 'NEET 2024',
      batchIds: [1],
      batches: ['Morning Batch A'],
      status: 'Draft',
      uploadDate: '2024-01-20',
      views: 0
    },
    { 
      id: 3, 
      title: 'Cell Structure and Function', 
      type: 'Video', 
      subjectId: 3,
      subject: 'Biology', 
      courseId: 1,
      course: 'NEET 2024',
      batchIds: [1, 2],
      batches: ['Morning Batch A', 'Evening Batch B'],
      status: 'Published',
      duration: '60 min',
      uploadDate: '2024-01-10',
      views: 890
    }
  ]);

  const [newContent, setNewContent] = useState({
    title: '',
    type: 'Video',
    courseId: '',
    subjectId: '',
    batchIds: [],
    description: '',
    file: null
  });

  const [filters, setFilters] = useState({
    search: '',
    course: 'all',
    subject: 'all',
    type: 'all',
    status: 'all'
  });

  const handleCreateContent = () => {
    if (!newContent.title || !newContent.courseId || !newContent.subjectId) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    const selectedCourse = courses.find(c => c.id === parseInt(newContent.courseId));
    const selectedSubject = subjects.find(s => s.id === parseInt(newContent.subjectId));
    const selectedBatches = batches.filter(b => newContent.batchIds.includes(b.id));

    const contentItem = {
      id: content.length + 1,
      title: newContent.title,
      type: newContent.type,
      subjectId: parseInt(newContent.subjectId),
      subject: selectedSubject?.name || '',
      courseId: parseInt(newContent.courseId),
      course: selectedCourse?.name || '',
      batchIds: newContent.batchIds,
      batches: selectedBatches.map(b => b.name),
      status: 'Draft',
      uploadDate: new Date().toISOString().split('T')[0],
      views: 0,
      duration: newContent.type === 'Video' ? '0 min' : undefined
    };

    setContent([...content, contentItem]);
    setNewContent({
      title: '',
      type: 'Video',
      courseId: '',
      subjectId: '',
      batchIds: [],
      description: '',
      file: null
    });
    toast({ title: "Success", description: "Content uploaded successfully!" });
  };

  const getFilteredSubjects = () => {
    if (!newContent.courseId) return [];
    return subjects.filter(s => s.courseId === parseInt(newContent.courseId));
  };

  const getFilteredBatches = () => {
    if (!newContent.courseId) return [];
    return batches.filter(b => b.courseId === parseInt(newContent.courseId));
  };

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCourse = filters.course === 'all' || item.courseId === parseInt(filters.course);
    const matchesSubject = filters.subject === 'all' || item.subjectId === parseInt(filters.subject);
    const matchesType = filters.type === 'all' || item.type === filters.type;
    const matchesStatus = filters.status === 'all' || item.status === filters.status;
    
    return matchesSearch && matchesCourse && matchesSubject && matchesType && matchesStatus;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Video': return <Video className="w-4 h-4" />;
      case 'Document': return <FileText className="w-4 h-4" />;
      case 'Image': return <Image className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8 bg-gradient-to-br from-orange-50 to-red-50 min-h-screen p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Content Management
            </h1>
            <p className="text-gray-600 mt-2">Upload and manage videos, documents, and study materials</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <Video className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-blue-800">{content.filter(c => c.type === 'Video').length} Videos</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <FileText className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-green-800">{content.filter(c => c.type === 'Document').length} Documents</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg text-center">
              <Upload className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-purple-800">{content.filter(c => c.status === 'Draft').length} Pending</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white shadow-md">
          <TabsTrigger value="upload" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">Upload Content</TabsTrigger>
          <TabsTrigger value="manage" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">Manage Content</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-r from-orange-50 to-orange-100">
            <CardHeader className="bg-orange-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Upload New Content
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contentTitle" className="text-orange-700 font-medium">Content Title *</Label>
                  <Input
                    id="contentTitle"
                    value={newContent.title}
                    onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                    placeholder="e.g., Newton's Laws of Motion"
                    className="border-orange-200 focus:border-orange-500"
                  />
                </div>
                <div>
                  <Label htmlFor="contentType" className="text-orange-700 font-medium">Content Type *</Label>
                  <Select value={newContent.type} onValueChange={(value) => setNewContent({...newContent, type: value})}>
                    <SelectTrigger className="border-orange-200 focus:border-orange-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Video">Video</SelectItem>
                      <SelectItem value="Document">Document</SelectItem>
                      <SelectItem value="Image">Image</SelectItem>
                      <SelectItem value="Audio">Audio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contentCourse" className="text-orange-700 font-medium">Course *</Label>
                  <Select 
                    value={newContent.courseId} 
                    onValueChange={(value) => setNewContent({...newContent, courseId: value, subjectId: '', batchIds: []})}
                  >
                    <SelectTrigger className="border-orange-200 focus:border-orange-500">
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
                  <Label htmlFor="contentSubject" className="text-orange-700 font-medium">Subject *</Label>
                  <Select 
                    value={newContent.subjectId} 
                    onValueChange={(value) => setNewContent({...newContent, subjectId: value})}
                    disabled={!newContent.courseId}
                  >
                    <SelectTrigger className="border-orange-200 focus:border-orange-500">
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
              </div>

              <div>
                <Label className="text-orange-700 font-medium">Target Batches</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                  {getFilteredBatches().map((batch) => (
                    <div key={batch.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`batch-${batch.id}`}
                        checked={newContent.batchIds.includes(batch.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewContent({...newContent, batchIds: [...newContent.batchIds, batch.id]});
                          } else {
                            setNewContent({...newContent, batchIds: newContent.batchIds.filter(id => id !== batch.id)});
                          }
                        }}
                        className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                      />
                      <label htmlFor={`batch-${batch.id}`} className="text-sm text-gray-700">
                        {batch.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="contentDescription" className="text-orange-700 font-medium">Description</Label>
                <Textarea
                  id="contentDescription"
                  value={newContent.description}
                  onChange={(e) => setNewContent({...newContent, description: e.target.value})}
                  placeholder="Describe the content and learning objectives..."
                  rows={3}
                  className="border-orange-200 focus:border-orange-500"
                />
              </div>

              <div>
                <Label htmlFor="contentFile" className="text-orange-700 font-medium">Upload File *</Label>
                <div className="mt-2 border-2 border-dashed border-orange-200 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                  <Upload className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Drag and drop your file here, or click to browse</p>
                  <Input
                    id="contentFile"
                    type="file"
                    className="hidden"
                    onChange={(e) => setNewContent({...newContent, file: e.target.files[0]})}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('contentFile').click()}
                    className="border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    Choose File
                  </Button>
                  {newContent.file && (
                    <p className="mt-2 text-sm text-green-600">
                      Selected: {newContent.file.name}
                    </p>
                  )}
                </div>
              </div>

              <Button onClick={handleCreateContent} className="w-full bg-orange-600 hover:bg-orange-700">
                <Upload className="w-4 h-4 mr-2" />
                Upload Content
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
                      placeholder="Search content..."
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
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filters.subject} onValueChange={(value) => setFilters({...filters, subject: value})}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Video">Video</SelectItem>
                      <SelectItem value="Document">Document</SelectItem>
                      <SelectItem value="Image">Image</SelectItem>
                      <SelectItem value="Audio">Audio</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content List */}
          <div className="grid gap-4">
            {filteredContent.map((item) => (
              <Card key={item.id} className="shadow-lg border-0 overflow-hidden hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="flex">
                    {/* Content Preview */}
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      {getTypeIcon(item.type)}
                    </div>
                    
                    {/* Content Details */}
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{item.title}</h3>
                          <div className="flex items-center space-x-3 mt-1">
                            <Badge className="bg-blue-100 text-blue-800">{item.course}</Badge>
                            <Badge variant="outline">{item.subject}</Badge>
                            <Badge 
                              variant={item.status === 'Published' ? 'default' : 'secondary'}
                              className={item.status === 'Published' ? 'bg-green-100 text-green-800' : ''}
                            >
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.batches.map((batch, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700">
                            {batch}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            {getTypeIcon(item.type)}
                            <span className="ml-1">{item.type}</span>
                          </span>
                          {item.duration && (
                            <span>Duration: {item.duration}</span>
                          )}
                          <span>Uploaded: {item.uploadDate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Play className="w-4 h-4" />
                          <span>{item.views} views</span>
                        </div>
                      </div>
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

export default ContentManagement;
