
import React, { useState } from 'react';
import { useStudent } from '@/contexts/StudentContext';
import VideoHeader from '@/containers/video/VideoHeader';
import VideoPlayer from '@/containers/video/VideoPlayer';
import VideoList from '@/containers/video/VideoList';
import BottomNavigation from '@/components/common/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, 
  FileText, 
  Image, 
  Download, 
  Search, 
  Filter,
  Book,
  Video,
  File,
  Clock,
  Eye
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
  const [selectedType, setSelectedType] = useState('all');
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
      thumbnail: '/placeholder.svg',
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
      thumbnail: '/placeholder.svg',
      url: '#',
      description: 'Complete notes on organic chemistry covering all important reactions and mechanisms.',
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
      thumbnail: '/placeholder.svg',
      url: '#',
      description: 'Detailed presentation on cell structure and organelles with high-quality diagrams.',
      uploadDate: '2024-01-13',
      views: 654
    },
    {
      id: '4',
      title: 'Mathematical Formulas Reference',
      type: 'doc',
      subject: 'Mathematics',
      topic: 'Calculus',
      size: '1.2 MB',
      thumbnail: '/placeholder.svg',
      url: '#',
      description: 'Quick reference document for all important calculus formulas and theorems.',
      uploadDate: '2024-01-12',
      views: 432
    },
    {
      id: '5',
      title: 'Periodic Table Diagram',
      type: 'image',
      subject: 'Chemistry',
      topic: 'Periodic Properties',
      size: '850 KB',
      thumbnail: '/placeholder.svg',
      url: '#',
      description: 'High-resolution periodic table with atomic masses and electron configurations.',
      uploadDate: '2024-01-11',
      views: 1100
    }
  ];

  const filteredMaterials = learningMaterials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || material.subject === selectedSubject;
    const matchesType = selectedType === 'all' || material.type === selectedType;
    return matchesSearch && matchesSubject && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5" />;
      case 'pdf': return <FileText className="w-5 h-5" />;
      case 'ppt': return <File className="w-5 h-5" />;
      case 'doc': return <Book className="w-5 h-5" />;
      case 'image': return <Image className="w-5 h-5" />;
      default: return <File className="w-5 h-5" />;
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
    toast({
      title: "Opening Material",
      description: `Loading ${material.title}...`,
    });
  };

  const handleDownload = (material: LearningMaterial) => {
    toast({
      title: "Download Started",
      description: `Downloading ${material.title}...`,
    });
  };

  const subjects = ['all', ...Array.from(new Set(learningMaterials.map(m => m.subject)))];
  const types = ['all', 'video', 'pdf', 'ppt', 'doc', 'image'];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <VideoHeader />
      
      <div className="p-4 space-y-6">
        {/* Enhanced Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="w-5 h-5" />
              Learning Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject === 'all' ? 'All Subjects' : subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>
                      {type === 'all' ? 'All Types' : type.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Material Types Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {types.slice(1).map(type => {
                const count = learningMaterials.filter(m => m.type === type).length;
                return (
                  <div key={type} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-center mb-2">
                      {getTypeIcon(type)}
                    </div>
                    <div className="font-medium">{count}</div>
                    <div className="text-sm text-gray-600 capitalize">{type}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={material.thumbnail} 
                    alt={material.title}
                    className="w-full h-40 object-cover rounded-t-lg"
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
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-xs">{material.subject}</Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(material);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {material.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {material.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{material.topic}</span>
                    <div className="flex items-center gap-1">
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
                        Watch Now
                      </>
                    ) : (
                      <>
                        {getTypeIcon(material.type)}
                        <span className="ml-2">Open {material.type.toUpperCase()}</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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

        {/* Original Video Components for backwards compatibility */}
        <div className="space-y-6">
          <VideoPlayer />
          <VideoList videos={videos} />
        </div>
      </div>
      
      <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
};

export default VideoLearning;
