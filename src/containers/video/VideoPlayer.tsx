
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, Settings, Download, Maximize } from 'lucide-react';

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Card className="overflow-hidden">
      <div className="relative bg-black aspect-video">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center text-white">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 ml-1" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Physics - Newton's Laws</h3>
            <p className="text-gray-300 text-sm">Chapter 4: Motion and Forces</p>
          </div>
        </div>
        
        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <span className="text-white text-sm">15:30 / 45:20</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                <Download className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                <Volume2 className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                <Settings className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-2">
            <div className="w-full bg-white/30 rounded-full h-1">
              <div className="bg-blue-500 h-1 rounded-full" style={{ width: '34%' }}></div>
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">Physics - Newton's Laws of Motion</h3>
            <p className="text-gray-600 text-sm mt-1">Dr. Rajesh Kumar • Physics • 45 min</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>Chapter 4</span>
              <span>•</span>
              <span>Beginner Level</span>
              <span>•</span>
              <span>1.2k views</span>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;
