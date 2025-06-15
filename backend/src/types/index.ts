
import { Request } from 'express';
import { User, Quiz } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: User;
  quiz?: Quiz;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchQuery extends PaginationQuery {
  search?: string;
  subject?: string;
  type?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface QuizAnswer {
  questionId: string;
  answer: string;
  timeTaken: number;
}

export interface QuizSubmission {
  quizId: string;
  answers: QuizAnswer[];
  totalTimeTaken: number;
}

export interface VideoUpload {
  title: string;
  description?: string;
  subject: string;
  topic: string;
  courseId: string;
  file: Express.Multer.File;
  thumbnail?: Express.Multer.File;
}

export interface MaterialUpload {
  title: string;
  description?: string;
  subject: string;
  topic: string;
  courseId: string;
  type: string;
  file: Express.Multer.File;
}

export interface SessionData {
  token: string;
  loginTime: Date;
  userId: string;
}

export interface QuizConfiguration {
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  negativeMarking?: boolean;
  negativeMarks?: number;
  timeLimit?: number;
  maxAttempts?: number;
}

export interface TestReport {
  testId: string;
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  questionAnalysis: QuestionAnalysis[];
}

export interface QuestionAnalysis {
  questionId: string;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  topic: string;
  difficulty: string;
}

export interface StudentTestResult {
  studentId: string;
  testId: string;
  score: number;
  percentage: number;
  rank: number;
  timeTaken: number;
  questionWiseResults: QuestionResult[];
}

export interface QuestionResult {
  questionId: string;
  isCorrect: boolean;
  studentAnswer: string;
  correctAnswer: string;
  marks: number;
}
