
import React from 'react';
import { useStudent } from '@/contexts/StudentContext';
import VideoHeader from '@/containers/video/VideoHeader';
import VideoPlayer from '@/containers/video/VideoPlayer';
import VideoList from '@/containers/video/VideoList';
import BottomNavigation from '@/components/common/BottomNavigation';

interface VideoLearningProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const VideoLearning: React.FC<VideoLearningProps> = ({ activeTab, onTabChange }) => {
  const { videos } = useStudent();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <VideoHeader />
      <div className="p-4 space-y-6">
        <VideoPlayer />
        <VideoList videos={videos} />
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
};

export default VideoLearning;
