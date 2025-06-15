
import { apiClient } from '../api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: 'STUDENT' | 'ADMIN';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      avatar?: string;
      studentProfile?: any;
    };
    token: string;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response;
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', userData);
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response;
  },

  getProfile: async () => {
    return await apiClient.get('/auth/profile');
  },

  logout: () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }
};
