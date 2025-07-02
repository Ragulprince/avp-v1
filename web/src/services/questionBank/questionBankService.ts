
import { apiClient } from '../api';

export interface Question {
  id: string;
  question: string;
  type: 'MCQ' | 'FILL_IN_THE_BLANK' | 'TRUE_FALSE' | 'MATCH' | 'CHOICE_BASED';
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
  question_text: string;
  type: 'MCQ' | 'FILL_IN_THE_BLANK' | 'TRUE_FALSE' | 'MATCH' | 'CHOICE_BASED';
  subject_id: string;
  topic: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  options?: string[];
  correct_answer: string;
  explanation?: string;
  marks?: number;
  left_side?: string;
  right_side?: string;
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
