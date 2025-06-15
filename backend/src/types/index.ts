import { Request } from 'express';
import { User, StudentProfile, Batch, Course } from '@prisma/client';

// Extended User type with optional relations - make it consistent
export type UserWithRelations = User & {
  studentProfile?: (StudentProfile & {
    batch?: Batch | null;
    course?: Course | null;
  }) | null;
};

export interface AuthRequest extends Request {
  user?: UserWithRelations;
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