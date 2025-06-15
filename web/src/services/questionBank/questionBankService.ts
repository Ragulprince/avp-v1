
import { apiClient } from '../api';

export interface Question {
  id: string;
  question: string;
  type: 'MCQ' | 'FILL_BLANKS' | 'TRUE_FALSE' | 'MATCH' | 'CHOICE_BASED';
  subject: string;
  topic: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  marks: number;
  createdAt: string;
}

export interface CreateQuestionData {
  question: string;
  type: 'MCQ' | 'FILL_BLANKS' | 'TRUE_FALSE' | 'MATCH' | 'CHOICE_BASED';
  subject: string;
  topic: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  marks?: number;
}

export interface QuestionQuery {
  page?: number;
  limit?: number;
  search?: string;
  subject?: string;
  topic?: string;
  difficulty?: string;
  type?: string;
}

export const questionBankService = {
  getQuestions: async (params: QuestionQuery = {}) => {
    return await apiClient.get('/question-bank', { params });
  },

  getQuestionById: async (id: string) => {
    return await apiClient.get(`/question-bank/${id}`);
  },

  createQuestion: async (data: CreateQuestionData) => {
    return await apiClient.post('/question-bank', data);
  },

  updateQuestion: async (id: string, data: Partial<CreateQuestionData>) => {
    return await apiClient.put(`/question-bank/${id}`, data);
  },

  deleteQuestion: async (id: string) => {
    return await apiClient.delete(`/question-bank/${id}`);
  },

  bulkImportQuestions: async (questions: CreateQuestionData[]) => {
    return await apiClient.post('/question-bank/bulk-import', { questions });
  }
};
