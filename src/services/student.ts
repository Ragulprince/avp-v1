
import { apiClient } from './api';

export const studentService = {
  async getDashboard() {
    return apiClient.get('/student/dashboard');
  },

  async getVideos(params?: any) {
    return apiClient.get('/student/videos', { params });
  },

  async getQuizzes() {
    return apiClient.get('/student/quizzes');
  },

  async getNotifications() {
    return apiClient.get('/student/notifications');
  },
};
