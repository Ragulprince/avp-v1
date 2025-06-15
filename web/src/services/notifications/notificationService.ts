
import { apiClient } from '../api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'GENERAL' | 'QUIZ' | 'VIDEO' | 'ANNOUNCEMENT' | 'REMINDER';
  isRead: boolean;
  userId?: string;
  data?: any;
  createdAt: string;
}

export interface CreateNotificationData {
  title: string;
  message: string;
  type: 'GENERAL' | 'QUIZ' | 'VIDEO' | 'ANNOUNCEMENT' | 'REMINDER';
  userId?: string;
  data?: any;
}

export interface NotificationQuery {
  page?: number;
  limit?: number;
  isRead?: boolean;
}

export const notificationService = {
  getUserNotifications: async (params: NotificationQuery = {}) => {
    return await apiClient.get('/notifications', { params });
  },

  createNotification: async (data: CreateNotificationData) => {
    return await apiClient.post('/notifications', data);
  },

  broadcastNotification: async (data: Omit<CreateNotificationData, 'userId'>) => {
    return await apiClient.post('/notifications/broadcast', data);
  },

  markAsRead: async (id: string) => {
    return await apiClient.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    return await apiClient.patch('/notifications/read-all');
  },

  deleteNotification: async (id: string) => {
    return await apiClient.delete(`/notifications/${id}`);
  }
};
