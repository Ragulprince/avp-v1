import { apiClient } from '../api';

export interface StudentProfile {
  full_name?: string;
  phone_number?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  date_of_birth?: string;
  gender?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const studentService = {
  getDashboard: async () => {
    return await apiClient.get('/student/dashboard');
  },

  getProfile: async () => {
    return await apiClient.get('/student/profile');
  },

  updateProfile: async (data: StudentProfile) => {
    return await apiClient.put('/student/profile', data);
  },

  changePassword: async (data: ChangePasswordData) => {
    return await apiClient.post('/student/change-password', data);
  },

  getStudentVideos: async () => {
    return await apiClient.get('/student/videos');
  },

  getStudentMaterials: async () => {
    return await apiClient.get('/student/materials');
  }
};
