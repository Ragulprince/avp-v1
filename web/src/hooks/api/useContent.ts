
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentService, MaterialQuery } from '@/services/content';
import { useToast } from '@/hooks/use-toast';

export const useStudyMaterials = (params: MaterialQuery = {}) => {
  return useQuery({
    queryKey: ['study-materials', params],
    queryFn: () => contentService.getStudyMaterials(params),
  });
};

export const useUploadMaterial = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => contentService.uploadStudyMaterial(formData),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Material uploaded successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['study-materials'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload material',
        variant: 'destructive',
      });
    },
  });
};

export const useUploadVideo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => contentService.uploadVideo(formData),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Video uploaded successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload video',
        variant: 'destructive',
      });
    },
  });
};

export const useDownloadFile = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (filename: string) => contentService.getFile(filename),
    onSuccess: (data, filename) => {
      // Create blob URL and trigger download
      const blob = new Blob([data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Success',
        description: 'File downloaded successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to download file',
        variant: 'destructive',
      });
    },
  });
};
