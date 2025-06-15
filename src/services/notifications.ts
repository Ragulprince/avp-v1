
import { apiClient } from './api';

export interface NotificationQuery {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}

export interface CreateNotificationData {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  userId?: string;
}

export const notificationService = {
  async getUserNotifications(params?: NotificationQuery) {
    return apiClient.get('/notifications', { params });
  },

  async createNotification(data: CreateNotificationData) {
    return apiClient.post('/notifications', data);
  },

  async broadcastNotification(data: Omit<CreateNotificationData, 'userId'>) {
    return apiClient.post('/notifications/broadcast', data);
  },

  async markAsRead(id: string) {
    return apiClient.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead() {
    return apiClient.patch('/notifications/read-all');
  },
};
