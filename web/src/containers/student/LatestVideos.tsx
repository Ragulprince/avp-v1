
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Download } from 'lucide-react';
import { useStudentVideos } from '@/hooks/api/useStudent';
import { useDownloadVideo } from '@/hooks/api/useVideos';

interface Video {
  id: string;
  title: string;
  subject: string;
  topic: string;
  duration: string;
  thumbnail: string;
  isNew?: boolean;
}

interface LatestVideosProps {
  videos?: Video[];
}

const LatestVideos: React.FC<LatestVideosProps> = ({ videos: propVideos }) => {
  const { data: videosData, isLoading } = useStudentVideos();
  const downloadVideo = useDownloadVideo();
  
  const videos = propVideos || videosData?.data?.slice(0, 5) || [];

  const handleDownload = (videoId: string) => {
    downloadVideo.mutate(videoId);
  };

  const defaultVideos = [
    {
      id: '1',
      title: 'Physics - Newton\'s Laws of Motion',
      subject: 'Physics',
      topic: 'Mechanics',
      duration: '45:30',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop',
      isNew: true
    },
    {
      id: '2',
      title: 'Mathematics - Calculus Fundamentals',
      subject: 'Mathematics',
      topic: 'Calculus',
      duration: '38:45',
      thumbnail: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&h=225&fit=crop'
    }
  ];

  const displayVideos = videos.length > 0 ? videos : defaultVideos;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Latest Lectures</h2>
        <Button variant="ghost" size="sm">View All</Button>
      </div>
      
      {isLoading ? (
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {[1, 2].map((i) => (
            <Card key={i} className="flex-shrink-0 w-72 lg:w-80 animate-pulse">
              <CardContent className="p-0">
                <div className="h-40 lg:h-44 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {displayVideos.map((video) => (
            <Card key={video.id} className="flex-shrink-0 w-72 lg:w-80 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-40 lg:h-44 object-cover rounded-t-lg"
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
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownload(video.id)}
                      disabled={downloadVideo.isPending}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm lg:text-base">
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
      )}
    </div>
  );
};

export default LatestVideos;
