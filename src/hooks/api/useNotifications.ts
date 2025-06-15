
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService, NotificationQuery, CreateNotificationData } from '@/services/notifications';
import { useToast } from '@/hooks/use-toast';

export const useNotifications = (params?: NotificationQuery) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationService.getUserNotifications(params),
  });
};

export const useCreateNotification = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNotificationData) => notificationService.createNotification(data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Notification created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create notification',
        variant: 'destructive',
      });
    },
  });
};

export const useBroadcastNotification = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<CreateNotificationData, 'userId'>) => notificationService.broadcastNotification(data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Notification broadcasted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to broadcast notification',
        variant: 'destructive',
      });
    },
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
