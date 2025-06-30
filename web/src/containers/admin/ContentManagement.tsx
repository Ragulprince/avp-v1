import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Edit, Trash2, Upload, Download, Video, FileText, Image, File, Eye } from 'lucide-react';
import { useContent } from '@/hooks/api/useContent';
import { useCourses } from '@/hooks/api/useAdmin';
import { useToast } from '@/hooks/use-toast';
import { MaterialType, MaterialStatus } from '@/types/content';
import { compressImage, compressPDF, compressDocument } from '@/utils/compression';

// Update UploadData interface for type safety
interface UploadData {
  title: string;
  description: string;
  subject?: string;
  topic?: string;
  courseId?: string;
  type: MaterialType;
  status: MaterialStatus;
}

const ContentManagement = () => {
  const { toast } = useToast();
  const { data: materialsResponse, isLoading: materialsLoading } = useContent();
  const { data: coursesResponse } = useCourses();
  
  const materials = materialsResponse?.data || [];
  const courses = coursesResponse?.data || [];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [contentUrl, setContentUrl] = useState<string>('');
  const [uploadData, setUploadData] = useState<UploadData>({
    title: '',
    description: '',
    type: MaterialType.PDF,
    status: MaterialStatus.DRAFT,
    courseId: undefined,
  });

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (material.description && material.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = !selectedSubject || material.subject === selectedSubject;
    const matchesType = !selectedType || material.type === selectedType;
    return matchesSearch && matchesSubject && matchesType;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      let compressedFile: File;
      const fileType = getFileType(file.name);

      switch (fileType) {
        case MaterialType.IMAGE:
          compressedFile = await compressImage(file);
          break;
        case MaterialType.PDF:
          compressedFile = await compressPDF(file);
          break;
        case MaterialType.DOC:
        case MaterialType.PPT:
          compressedFile = await compressDocument(file);
          break;
        default:
          compressedFile = file;
      }

      setUploadFile(compressedFile);
      setUploadData(prev => ({
        ...prev,
        title: file.name.split('.')[0] || '',
        type: fileType,
      }));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to compress file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCompressing(false);
    }
  };

  const getFileType = (filename: string): MaterialType => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    switch (ext) {
      case 'pdf': return MaterialType.PDF;
      case 'ppt':
      case 'pptx': return MaterialType.PPT;
      case 'doc':
      case 'docx': return MaterialType.DOC;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return MaterialType.IMAGE;
      default: return MaterialType.OTHER;
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadData.title || !uploadData.courseId) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields and select a file',
        variant: 'destructive',
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('title', uploadData.title);
      formData.append('description', uploadData.description);
      formData.append('courseId', uploadData.courseId.toString());
      formData.append('type', uploadData.type);

      // Call the actual API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/content`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Material uploaded successfully',
        });
        
        // Refresh the materials list
        window.location.reload();
      } else {
        throw new Error(result.message || 'Upload failed');
      }
      
      setIsUploadDialogOpen(false);
      setUploadFile(null);
      setUploadData({
        title: '',
        description: '',
        type: MaterialType.PDF,
        status: MaterialStatus.DRAFT,
        courseId: undefined,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload material',
        variant: 'destructive',
      });
    }
  };

  const handleViewMaterial = async (material: any) => {
    try {
      // Fetch the content with authentication
      const response = await fetch(`${import.meta.env.VITE_API_URL}/content/view/${material.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load content');
      }

      // Create a blob URL for the content
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setContentUrl(url);
      setSelectedMaterial(material);
      setIsViewerOpen(true);
    } catch (error) {
      console.error('Error loading content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load content. Please check your authentication.',
        variant: 'destructive',
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="w-5 h-5 text-red-500" />;
      case 'VIDEO': return <Video className="w-5 h-5 text-blue-500" />;
      case 'IMAGE': return <Image className="w-5 h-5 text-green-500" />;
      default: return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const subjects = ['Physics', 'Chemistry', 'Biology', 'Mathematics'];
  const fileTypes = ['PDF', 'PPT', 'DOC', 'IMAGE', 'VIDEO', 'OTHER'];

  if (materialsLoading) {
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
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600 mt-1">Upload and manage study materials</p>
        </div>
        
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              Upload Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Study Material</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="file">Select File *</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={uploadData.title}
                    onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="course">Course</Label>
                  <Select
                    value={uploadData.courseId || ''}
                    onValueChange={(value) => setUploadData({ ...uploadData, courseId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => {
                        const courseId = (course.course_id || course.id).toString();
                        return (
                          <SelectItem key={courseId} value={courseId}>
                            {course.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select 
                    value={uploadData.subject || ''} 
                    onValueChange={(value) => setUploadData({...uploadData, subject: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    value={uploadData.topic || ''}
                    onChange={(e) => setUploadData({...uploadData, topic: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={uploadData.description}
                  onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={uploadData.type} 
                  onValueChange={(value) => setUploadData({...uploadData, type: value as MaterialType})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MaterialType.PDF}>PDF</SelectItem>
                    <SelectItem value={MaterialType.PPT}>PPT</SelectItem>
                    <SelectItem value={MaterialType.DOC}>DOC</SelectItem>
                    <SelectItem value={MaterialType.IMAGE}>Image</SelectItem>
                    <SelectItem value={MaterialType.OTHER}>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={uploadData.status} 
                  onValueChange={(value) => setUploadData({...uploadData, status: value as MaterialStatus})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MaterialStatus.DRAFT}>Draft</SelectItem>
                    <SelectItem value={MaterialStatus.PUBLISHED}>Published</SelectItem>
                    <SelectItem value={MaterialStatus.ARCHIVED}>Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload}>
                Upload Material
              </Button>
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
                <p className="text-sm font-medium text-gray-600">Total Materials</p>
                <p className="text-2xl font-bold">{materials.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold">{materials.filter(m => m.isPublished).length}</p>
              </div>
              <Upload className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Videos</p>
                <p className="text-2xl font-bold">{materials.filter(m => m.type === 'VIDEO').length}</p>
              </div>
              <Video className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">PDFs</p>
                <p className="text-2xl font-bold">{materials.filter(m => m.type === 'PDF').length}</p>
              </div>
              <FileText className="w-8 h-8 text-red-500" />
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
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select 
              value={selectedSubject || 'all'} 
              onValueChange={(value) => setSelectedSubject(value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={selectedType || 'all'} 
              onValueChange={(value) => setSelectedType(value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {fileTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedSubject('');
                setSelectedType('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => (
          <Card key={String(material.id ?? Math.random())} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(material.type)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{material.title}</h3>
                    <Badge variant={material.isPublished ? 'default' : 'secondary'}>
                      {material.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewMaterial(material)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {material.description || 'No description available'}
              </p>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subject:</span>
                  <span className="font-medium">{material.subject}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Topic:</span>
                  <span className="font-medium">{material.topic}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{material.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium">{material.fileSize}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Material Viewer Dialog */}
      <Dialog open={isViewerOpen} onOpenChange={(open) => {
        setIsViewerOpen(open);
        if (!open) {
          // Clean up blob URL when dialog closes
          if (contentUrl) {
            URL.revokeObjectURL(contentUrl);
            setContentUrl('');
          }
          setSelectedMaterial(null);
        }
      }}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedMaterial?.title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
          {selectedMaterial && contentUrl && (
  <div className="flex flex-col items-center justify-center h-full space-y-4">
    <p className="text-gray-600">Click the button below to open the file in a new tab.</p>
    <Button
      onClick={() => window.open(contentUrl, '_blank')}
      className="bg-blue-600 hover:bg-blue-700"
    >
      View File
    </Button>
  </div>
)}

            {selectedMaterial?.type === 'IMAGE' && contentUrl && (
              <img
                src={contentUrl}
                alt={selectedMaterial.title}
                className="max-w-full h-auto"
              />
            )}
            {selectedMaterial?.type === 'VIDEO' && contentUrl && (
              <video
                src={contentUrl}
                controls
                className="w-full"
              />
            )}
            {!contentUrl && selectedMaterial && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading content...</p>
                </div>
              </div>
            )}
            {/* Add other content type viewers as needed */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentManagement;