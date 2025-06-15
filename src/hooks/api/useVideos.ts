
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { videoService, VideoQuery } from '@/services/videos';
import { useToast } from '@/hooks/use-toast';

export const useVideos = (params?: VideoQuery) => {
  return useQuery({
    queryKey: ['videos', params],
    queryFn: () => videoService.getVideos(params),
  });
};

export const useVideoById = (id: string) => {
  return useQuery({
    queryKey: ['video', id],
    queryFn: () => videoService.getVideoById(id),
    enabled: !!id,
  });
};

export const useDownloadVideo = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => videoService.downloadVideo(id),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Video download started',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to download video',
        variant: 'destructive',
      });
    },
  });
};

export const useVideoSubjects = () => {
  return useQuery({
    queryKey: ['video-subjects'],
    queryFn: videoService.getVideoSubjects,
  });
};
