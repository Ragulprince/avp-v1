import React from 'react';
import { useStudent } from '@/contexts/StudentContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, BookOpen, FileText, Download, Clock, File, Presentation, FileImage } from 'lucide-react';

const LearningHub = () => {
  const { videos } = useStudent();

  const studyMaterials = [
    {
      id: '1',
      title: 'Physics Formula Sheet - Mechanics',
      subject: 'Physics',
      type: 'PDF',
      size: '2.4 MB',
      downloadCount: 245,
      icon: FileText,
      color: 'text-red-600 bg-red-50'
    },
    {
      id: '2',
      title: 'Chemistry Organic Reactions Summary',
      subject: 'Chemistry',
      type: 'PDF',
      size: '1.8 MB',
      downloadCount: 189,
      icon: FileText,
      color: 'text-red-600 bg-red-50'
    },
    {
      id: '3',
      title: 'Biology Cell Structure Diagrams',
      subject: 'Biology',
      type: 'PPT',
      size: '5.2 MB',
      downloadCount: 156,
      icon: Presentation,
      color: 'text-orange-600 bg-orange-50'
    },
    {
      id: '4',
      title: 'Mathematics Integration Techniques',
      subject: 'Mathematics',
      type: 'DOC',
      size: '1.2 MB',
      downloadCount: 203,
      icon: File,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      id: '5',
      title: 'Physics Lab Manual',
      subject: 'Physics',
      type: 'PDF',
      size: '8.5 MB',
      downloadCount: 134,
      icon: FileText,
      color: 'text-red-600 bg-red-50'
    },
    {
      id: '6',
      title: 'Chemistry Periodic Table Chart',
      subject: 'Chemistry',
      type: 'IMAGE',
      size: '3.1 MB',
      downloadCount: 287,
      icon: FileImage,
      color: 'text-green-600 bg-green-50'
    }
  ];

  const practiceMaterials = [
    {
      id: '1',
      title: 'Previous Year Questions - Physics',
      subject: 'Physics',
      questions: 150,
      difficulty: 'Mixed'
    },
    {
      id: '2',
      title: 'Sample Papers - Chemistry',
      subject: 'Chemistry',
      questions: 200,
      difficulty: 'Hard'
    },
    {
      id: '3',
      title: 'Quick Revision - Biology',
      subject: 'Biology',
      questions: 75,
      difficulty: 'Easy'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Hub</h1>
        <p className="text-gray-600">Access all your study materials in one place</p>
      </div>

      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="videos">Video Lectures</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="notes">Study Notes</TabsTrigger>
          <TabsTrigger value="practice">Practice Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="space-y-4">
          <div className="grid gap-4">
            {videos.map((video) => (
              <Card key={video.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="relative">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-48 h-32 object-cover rounded-l-lg"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-l-lg">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                        {video.duration}
                      </div>
                      {video.isNew && (
                        <Badge className="absolute top-2 left-2 bg-green-500">New</Badge>
                      )}
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-2">
                            {video.title}
                          </h3>
                          <div className="flex gap-2 mb-3">
                            <Badge variant="outline">{video.subject}</Badge>
                            <Badge variant="outline">{video.topic}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            Uploaded on {new Date(video.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button size="sm">
                            <Play className="w-4 h-4 mr-2" />
                            Watch
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="grid gap-4">
            {studyMaterials.map((material) => {
              const IconComponent = material.icon;
              return (
                <Card key={material.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`p-3 rounded-lg ${material.color}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 mb-2">
                            {material.title}
                          </h3>
                          <div className="flex gap-2 mb-2">
                            <Badge variant="outline">{material.subject}</Badge>
                            <Badge variant="outline">{material.type}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{material.size}</span>
                            <span>{material.downloadCount} downloads</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Preview
                        </Button>
                        <Button size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <div className="grid gap-4">
            {studyMaterials.filter(material => material.type === 'PDF').map((note) => (
              <Card key={note.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">
                          {note.title}
                        </h3>
                        <div className="flex gap-2 mb-2">
                          <Badge variant="outline">{note.subject}</Badge>
                          <Badge variant="outline">{note.type}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{note.size}</span>
                          <span>{note.downloadCount} downloads</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                      <Button size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="practice" className="space-y-4">
          <div className="grid gap-4">
            {practiceMaterials.map((material) => (
              <Card key={material.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <BookOpen className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">
                          {material.title}
                        </h3>
                        <div className="flex gap-2 mb-2">
                          <Badge variant="outline">{material.subject}</Badge>
                          <Badge variant="outline">{material.difficulty}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {material.questions} questions
                        </p>
                      </div>
                    </div>
                    <Button>
                      <Play className="w-4 h-4 mr-2" />
                      Start Practice
                    </Button>
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

export default LearningHub;
