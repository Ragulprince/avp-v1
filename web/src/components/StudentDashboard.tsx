
import React from 'react';
import { useStudent } from '@/contexts/StudentContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, BookOpen, Award, Bell, Download } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

const StudentDashboard = () => {
  const { student, videos, language } = useStudent();

  const motivationalVideo = {
    title: 'Daily Motivation - Believe in Yourself',
    thumbnail: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=225&fit=crop'
  };

  const announcements = [
    'New Physics lecture uploaded: Quantum Mechanics',
    'Mock test scheduled for tomorrow at 10 AM',
    'Study materials updated for Chemistry'
  ];

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
              3
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
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {videos.map((video) => (
            <Card key={video.id} className="flex-shrink-0 w-80 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-44 object-cover rounded-t-lg"
                  />
                  {video.isNew && (
                    <Badge className="absolute top-2 left-2 bg-green-500">New</Badge>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-xs">{video.subject}</Badge>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{video.topic}</p>
                  <Button className="w-full" size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">24h</p>
            <p className="text-sm text-gray-600">Study Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">12</p>
            <p className="text-sm text-gray-600">Videos Watched</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">85%</p>
            <p className="text-sm text-gray-600">Avg Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Play className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">8</p>
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
            {announcements.map((announcement, index) => (
              <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <p className="text-sm text-gray-700">{announcement}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
