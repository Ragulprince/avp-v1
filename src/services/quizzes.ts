
import { apiClient } from './api';

export interface QuizQuery {
  subject?: string;
  difficulty?: string;
  type?: string;
}

export interface QuizSubmission {
  quizId: string;
  answers: Record<string, any>;
  timeSpent: number;
}

export const quizService = {
  async getQuizzes(params?: QuizQuery) {
    return apiClient.get('/quizzes', { params });
  },

  async getQuizById(id: string) {
    return apiClient.get(`/quizzes/${id}`);
  },

  async submitQuiz(submission: QuizSubmission) {
    return apiClient.post('/quizzes/submit', submission);
  },

  async getQuizAttempts() {
    return apiClient.get('/quizzes/attempts');
  },
};
