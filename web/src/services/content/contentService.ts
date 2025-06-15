
import { apiClient } from '../api';

export interface StudyMaterial {
  id: string;
  title: string;
  description?: string;
  subject: string;
  topic: string;
  type: 'PDF' | 'PPT' | 'DOC' | 'IMAGE' | 'OTHER';
  fileUrl: string;
  fileName: string;
  fileSize: string;
  isPublished: boolean;
  courseId: string;
  course?: any;
  createdAt: string;
}

export interface MaterialQuery {
  page?: number;
  limit?: number;
  search?: string;
  subject?: string;
  type?: string;
  courseId?: string;
}

export const contentService = {
  getStudyMaterials: async (params: MaterialQuery = {}) => {
    return await apiClient.get('/content/materials', { params });
  },

  uploadStudyMaterial: async (formData: FormData) => {
    return await apiClient.post('/content/materials/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  uploadVideo: async (formData: FormData) => {
    return await apiClient.post('/content/videos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  toggleMaterialPublish: async (id: string, isPublished: boolean) => {
    return await apiClient.patch(`/content/materials/${id}/publish`, { isPublished });
  },

  getFile: async (filename: string) => {
    return await apiClient.get(`/content/files/${filename}`, {
      responseType: 'blob',
    });
  }
};
