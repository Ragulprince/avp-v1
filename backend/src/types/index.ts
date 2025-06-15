
import { Request } from 'express';
import { User } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: User;
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
