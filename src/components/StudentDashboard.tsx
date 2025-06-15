
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, BookOpen, Award, Bell, Download } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { useStudentDashboard, useStudentVideos } from '@/hooks/api/useStudent';
import { useDownloadVideo } from '@/hooks/api/useVideos';
import { useStudent } from '@/contexts/StudentContext';

const StudentDashboard = () => {
  const { data: dashboardData, isLoading: dashboardLoading } = useStudentDashboard();
  const { data: videosData, isLoading: videosLoading } = useStudentVideos();
  const downloadVideo = useDownloadVideo();
  const { student } = useStudent();

  const videos = videosData?.data || [];
  const stats = dashboardData?.data?.stats || {};
  const announcements = dashboardData?.data?.announcements || [];

  const motivationalVideo = {
    title: 'Daily Motivation - Believe in Yourself',
    thumbnail: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=225&fit=crop'
  };

  const handleVideoWatch = (videoId: string) => {
    console.log('Watching video:', videoId);
    // Navigate to video player
  };

  const handleVideoDownload = (videoId: string) => {
    downloadVideo.mutate(videoId);
  };

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Hi {student.name} 👋
          </h1>
          <p className="text-gray-600">{student.batch}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {stats.unreadNotifications || 0}
            </span>
          </Button>
          <LanguageSelector />
        </div>
      </div>

      {/* Motivational Video */}
      <Card className="overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardContent className="p-0">
          <div className="relative">
            <img 
              src={motivationalVideo.thumbnail} 
              alt="Motivational Video"
              className="w-full h-48 object-cover opacity-70"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Button size="lg" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                <Play className="w-6 h-6 mr-2" />
                Watch Daily Motivation
              </Button>
            </div>
            <div className="absolute bottom-4 left-4">
              <h3 className="font-semibold">{motivationalVideo.title}</h3>
              <p className="text-sm opacity-90">Start your day with inspiration</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Latest Videos */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Latest Lectures</h2>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        {videosLoading ? (
          <div className="text-center py-8">Loading videos...</div>
        ) : (
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {videos.slice(0, 5).map((video: any) => (
              <Card key={video.id} className="flex-shrink-0 w-80 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={video.thumbnail || 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=225&fit=crop'} 
                      alt={video.title}
                      className="w-full h-44 object-cover rounded-t-lg"
                    />
                    {video.isNew && (
                      <Badge className="absolute top-2 left-2 bg-green-500">New</Badge>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      {video.duration || '45:00'}
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
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{video.topic}</p>
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={() => handleVideoWatch(video.id)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Watch Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.studyTime || '0h'}</p>
            <p className="text-sm text-gray-600">Study Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.videosWatched || '0'}</p>
            <p className="text-sm text-gray-600">Videos Watched</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.avgScore || '0'}%</p>
            <p className="text-sm text-gray-600">Avg Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Play className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.testsTaken || '0'}</p>
            <p className="text-sm text-gray-600">Tests Taken</p>
          </CardContent>
        </Card>
      </div>

      {/* Announcements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {announcements.length > 0 ? (
              announcements.map((announcement: any, index: number) => (
                <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{announcement.title}</p>
                    <p className="text-xs text-gray-600">{announcement.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">No announcements at this time.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
