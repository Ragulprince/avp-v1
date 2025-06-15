
import React, { useState } from 'react';
import { useStudent } from '@/contexts/StudentContext';
import VideoHeader from '@/containers/video/VideoHeader';
import BottomNavigation from '@/components/common/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Play, 
  FileText, 
  Image, 
  Download, 
  Search, 
  Book,
  Video,
  File,
  Clock,
  Eye,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoLearningProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface LearningMaterial {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'ppt' | 'doc' | 'image';
  subject: string;
  topic: string;
  duration?: string;
  size?: string;
  thumbnail: string;
  url: string;
  description: string;
  uploadDate: string;
  views: number;
  isNew?: boolean;
}

const VideoLearning: React.FC<VideoLearningProps> = ({ activeTab, onTabChange }) => {
  const { videos } = useStudent();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [currentMaterial, setCurrentMaterial] = useState<string | null>(null);
  const { toast } = useToast();

  const learningMaterials: LearningMaterial[] = [
    {
      id: '1',
      title: 'Newton\'s Laws of Motion',
      type: 'video',
      subject: 'Physics',
      topic: 'Classical Mechanics',
      duration: '45:30',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop',
      url: '#',
      description: 'Comprehensive explanation of Newton\'s three laws of motion with practical examples.',
      uploadDate: '2024-01-15',
      views: 1250,
      isNew: true
    },
    {
      id: '2',
      title: 'Organic Chemistry Notes',
      type: 'pdf',
      subject: 'Chemistry',
      topic: 'Organic Chemistry',
      size: '2.5 MB',
      thumbnail: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=400&h=225&fit=crop',
      url: '#',
      description: 'Complete notes on organic chemistry covering all important reactions.',
      uploadDate: '2024-01-14',
      views: 890
    },
    {
      id: '3',
      title: 'Cell Structure Presentation',
      type: 'ppt',
      subject: 'Biology',
      topic: 'Cell Biology',
      size: '8.1 MB',
      thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=225&fit=crop',
      url: '#',
      description: 'Detailed presentation on cell structure and organelles.',
      uploadDate: '2024-01-13',
      views: 654
    }
  ];

  const filteredMaterials = learningMaterials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || material.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'ppt': return <File className="w-4 h-4" />;
      case 'doc': return <Book className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800';
      case 'pdf': return 'bg-blue-100 text-blue-800';
      case 'ppt': return 'bg-orange-100 text-orange-800';
      case 'doc': return 'bg-green-100 text-green-800';
      case 'image': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMaterialClick = (material: LearningMaterial) => {
    setCurrentMaterial(material.id);
  };

  const subjects = ['all', ...Array.from(new Set(learningMaterials.map(m => m.subject)))];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Learning Hub</h1>
          <p className="text-blue-100">Access all your learning materials in one place</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Enhanced Search and Filters */}
        <Card className="shadow-sm">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {subjects.map(subject => (
                  <Button
                    key={subject}
                    variant={selectedSubject === subject ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSubject(subject)}
                    className="whitespace-nowrap"
                  >
                    {subject === 'all' ? 'All' : subject}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Material Type Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="all" className="flex items-center gap-1">
              <Book className="w-4 h-4" />
              All
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-1">
              <Video className="w-4 h-4" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="pdf" className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              PDFs
            </TabsTrigger>
            <TabsTrigger value="ppt" className="flex items-center gap-1">
              <File className="w-4 h-4" />
              PPTs
            </TabsTrigger>
            <TabsTrigger value="doc" className="flex items-center gap-1">
              <Book className="w-4 h-4" />
              Docs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredMaterials.map((material) => (
                <Card key={material.id} className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={material.thumbnail} 
                      alt={material.title}
                      className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {material.isNew && (
                      <Badge className="absolute top-2 left-2 bg-green-500">New</Badge>
                    )}
                    <Badge className={`absolute top-2 right-2 ${getTypeColor(material.type)}`}>
                      <span className="flex items-center gap-1">
                        {getTypeIcon(material.type)}
                        {material.type.toUpperCase()}
                      </span>
                    </Badge>
                    {material.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {material.duration}
                      </div>
                    )}
                    {material.size && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                        {material.size}
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-xs">{material.subject}</Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm md:text-base">
                      {material.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {material.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span className="truncate">{material.topic}</span>
                      <div className="flex items-center gap-1 ml-2">
                        <Eye className="w-3 h-3" />
                        {material.views}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={() => handleMaterialClick(material)}
                    >
                      {material.type === 'video' ? (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Watch
                        </>
                      ) : (
                        <>
                          {getTypeIcon(material.type)}
                          <span className="ml-2">Open</span>
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {['video', 'pdf', 'ppt', 'doc'].map(type => (
            <TabsContent key={type} value={type} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredMaterials.filter(m => m.type === type).map((material) => (
                  <Card key={material.id} className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                    {/* Same card content as above */}
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img 
                        src={material.thumbnail} 
                        alt={material.title}
                        className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      {material.isNew && (
                        <Badge className="absolute top-2 left-2 bg-green-500">New</Badge>
                      )}
                      <Badge className={`absolute top-2 right-2 ${getTypeColor(material.type)}`}>
                        <span className="flex items-center gap-1">
                          {getTypeIcon(material.type)}
                          {material.type.toUpperCase()}
                        </span>
                      </Badge>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {material.title}
                      </h3>
                      <Button 
                        className="w-full" 
                        size="sm"
                        onClick={() => handleMaterialClick(material)}
                      >
                        {getTypeIcon(material.type)}
                        <span className="ml-2">Open</span>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* No Results */}
        {filteredMaterials.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
};

export default VideoLearning;
