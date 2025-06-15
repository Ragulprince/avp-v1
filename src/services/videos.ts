
import { apiClient } from './api';

export interface VideoQuery {
  search?: string;
  subject?: string;
  page?: number;
  limit?: number;
}

export const videoService = {
  async getVideos(params?: VideoQuery) {
    return apiClient.get('/videos', { params });
  },

  async getVideoById(id: string) {
    return apiClient.get(`/videos/${id}`);
  },

  async downloadVideo(id: string) {
    return apiClient.post(`/videos/${id}/download`);
  },

  async getVideoSubjects() {
    return apiClient.get('/videos/subjects');
  },
};
