
import { apiClient } from '../api';

export interface Test {
  id: string;
  title: string;
  subject: string;
  type: 'PRACTICE' | 'MOCK' | 'DAILY' | 'SUBJECT_WISE' | 'CUSTOM';
  duration: number;
  totalMarks: number;
  passingMarks: number;
  isPublished: boolean;
  courseId: string;
  createdAt: string;
}

export interface CreateTestData {
  title: string;
  subject: string;
  type: 'PRACTICE' | 'MOCK' | 'DAILY' | 'SUBJECT_WISE' | 'CUSTOM';
  duration: number;
  totalMarks: number;
  passingMarks: number;
  courseId: string;
}

export const testService = {
  getTests: async () => {
    return await apiClient.get('/tests');
  },

  createTest: async (data: CreateTestData) => {
    return await apiClient.post('/tests', data);
  },

  addQuestionToTest: async (testId: string, questionData: any) => {
    return await apiClient.post(`/tests/${testId}/questions`, questionData);
  },

  getTestReport: async (testId: string) => {
    return await apiClient.get(`/tests/${testId}/report`);
  },

  getStudentTestReport: async (testId: string, studentId: string) => {
    return await apiClient.get(`/tests/${testId}/students/${studentId}/report`);
  },

  toggleTestPublish: async (testId: string, isPublished: boolean) => {
    return await apiClient.patch(`/tests/${testId}/publish`, { isPublished });
  }
};
