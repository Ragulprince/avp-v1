
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Download } from 'lucide-react';

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
  videos: Video[];
}

const LatestVideos: React.FC<LatestVideosProps> = ({ videos }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Latest Lectures</h2>
        <Button variant="ghost" size="sm">View All</Button>
      </div>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {videos.map((video) => (
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
                  <Button variant="ghost" size="sm">
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
    </div>
  );
};

export default LatestVideos;
