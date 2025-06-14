
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const MotivationalVideo = () => {
  const motivationalVideo = {
    title: 'Daily Motivation - Believe in Yourself',
    thumbnail: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=225&fit=crop'
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={motivationalVideo.thumbnail} 
            alt="Motivational Video"
            className="w-full h-40 lg:h-48 object-cover opacity-70"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Button size="lg" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
              <Play className="w-5 h-5 lg:w-6 lg:h-6 mr-2" />
              Watch Daily Motivation
            </Button>
          </div>
          <div className="absolute bottom-4 left-4">
            <h3 className="font-semibold text-sm lg:text-base">{motivationalVideo.title}</h3>
            <p className="text-xs lg:text-sm opacity-90">Start your day with inspiration</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MotivationalVideo;
