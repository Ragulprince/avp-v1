
import { Request } from 'express';
import { User, StudentProfile, Batch, Course } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: User & {
    studentProfile?: StudentProfile & {
      batch?: Batch;
      course?: Course;
    };
  };
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface QuizQuery extends PaginationQuery {
  subject?: string;
  type?: string;
  difficulty?: string;
}

export interface VideoQuery extends PaginationQuery {
  subject?: string;
  courseId?: string;
}
