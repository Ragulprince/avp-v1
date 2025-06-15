
import { apiClient } from './api';

export interface MaterialQuery {
  search?: string;
  subject?: string;
  type?: string;
}

export const contentService = {
  async getStudyMaterials(params?: MaterialQuery) {
    return apiClient.get('/content/materials', { params });
  },

  async uploadStudyMaterial(formData: FormData) {
    return apiClient.post('/content/materials', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async uploadVideo(formData: FormData) {
    return apiClient.post('/content/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async getFile(filename: string) {
    return apiClient.get(`/content/files/${filename}`, {
      responseType: 'blob',
    });
  },
};
