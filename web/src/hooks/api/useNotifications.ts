
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notifications';
import { useToast } from '@/hooks/use-toast';

export const useNotifications = (params: any = {}) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationService.getUserNotifications(params),
  });
};

export const useCreateNotification = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => notificationService.createNotification(data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Notification sent successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send notification',
        variant: 'destructive',
      });
    },
  });
};
