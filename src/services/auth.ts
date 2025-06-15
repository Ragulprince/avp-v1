
import { apiClient } from './api';

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

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  studentProfile?: any;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post('/auth/login', credentials);
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    return apiClient.post('/auth/register', userData);
  },

  async getProfile(): Promise<{ success: boolean; data: User }> {
    return apiClient.get('/auth/profile');
  },
};
