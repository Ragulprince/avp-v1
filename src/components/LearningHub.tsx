
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Play, Download, Search, Filter, BookOpen, Clock } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import { useVideos, useVideoSubjects, useDownloadVideo } from '@/hooks/api/useVideos';
import { useStudyMaterials, useDownloadFile } from '@/hooks/api/useContent';

const LearningHub = () => {
  const [activeTab, setActiveTab] = useState('videos');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const { data: videosData, isLoading: videosLoading } = useVideos({
    search: searchQuery,
    subject: selectedSubject,
  });
  
  const { data: materialsData, isLoading: materialsLoading } = useStudyMaterials({
    search: searchQuery,
    subject: selectedSubject,
  });
  
  const { data: subjectsData } = useVideoSubjects();
  const downloadVideo = useDownloadVideo();
  const downloadFile = useDownloadFile();

  const videos = videosData?.data || [];
  const materials = materialsData?.data || [];
  const subjects = subjectsData?.data || [];

  if (selectedVideo) {
    return <VideoPlayer videoId={selectedVideo} onBack={() => setSelectedVideo(null)} />;
  }

  const handleVideoWatch = (videoId: string) => {
    setSelectedVideo(videoId);
  };

  const handleVideoDownload = (videoId: string) => {
    downloadVideo.mutate(videoId);
  };

  const handleFileDownload = (filename: string) => {
    downloadFile.mutate(filename);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Hub</h1>
        <p className="text-gray-600">Access your study materials and video lectures</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search for videos or materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Subjects</option>
          {subjects.map((subject: string) => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <Button
          variant={activeTab === 'videos' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('videos')}
          className="flex-1"
        >
          <Play className="w-4 h-4 mr-2" />
          Videos
        </Button>
        <Button
          variant={activeTab === 'materials' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('materials')}
          className="flex-1"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Materials
        </Button>
      </div>

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div>
          {videosLoading ? (
            <div className="text-center py-8">Loading videos...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((video: any) => (
                <Card key={video.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img 
                        src={video.thumbnail || 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=225&fit=crop'} 
                        alt={video.title}
                        className="w-full h-44 object-cover rounded-t-lg"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                        {video.duration || '45:00'}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50 rounded-t-lg">
                        <Button 
                          size="lg"
                          onClick={() => handleVideoWatch(video.id)}
                          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                        >
                          <Play className="w-6 h-6" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-xs">{video.subject}</Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleVideoDownload(video.id)}
                          disabled={downloadVideo.isPending}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-2">{video.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{video.topic}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {video.views || 0} views
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Materials Tab */}
      {activeTab === 'materials' && (
        <div>
          {materialsLoading ? (
            <div className="text-center py-8">Loading materials...</div>
          ) : (
            <div className="space-y-3">
              {materials.map((material: any) => (
                <Card key={material.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="text-xs">{material.subject}</Badge>
                          <Badge variant="secondary" className="text-xs">{material.type}</Badge>
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1">{material.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{material.description}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>{material.fileSize}</span>
                          <span className="mx-2">•</span>
                          <span>{material.topic}</span>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handleFileDownload(material.fileName)}
                        disabled={downloadFile.isPending}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LearningHub;
