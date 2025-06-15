import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';
import { logger } from '../config/logger';

export const validateQuizAccess = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { quizId } = req.body;
    const userId = req.user?.id;

    if (!quizId || !userId) {
      res.status(400).json({
        success: false,
        message: 'Quiz ID and user authentication required'
      });
      return;
    }

    // Check if quiz exists and is published
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        course: true
      }
    });

    if (!quiz) {
      res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
      return;
    }

    if (!quiz.isPublished) {
      res.status(403).json({
        success: false,
        message: 'Quiz is not published yet'
      });
      return;
    }

    // Check if quiz has expired
    if (quiz.expiresAt && new Date() > quiz.expiresAt) {
      res.status(403).json({
        success: false,
        message: 'Quiz has expired'
      });
      return;
    }

    // Check if quiz is scheduled for future
    if (quiz.scheduledAt && new Date() < quiz.scheduledAt) {
      res.status(403).json({
        success: false,
        message: 'Quiz is not yet available'
      });
      return;
    }

    // Check if student belongs to the correct course
    const student = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true
      }
    });

    if (!student?.studentProfile || student.studentProfile.courseId !== quiz.courseId) {
      res.status(403).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
      return;
    }

    // Check if student has already attempted the quiz
    const existingAttempt = await prisma.quizAttempt.findFirst({
      where: {
        userId,
        quizId,
        isCompleted: true
      }
    });

    if (existingAttempt) {
      res.status(403).json({
        success: false,
        message: 'You have already completed this quiz'
      });
      return;
    }

    // Add quiz to request for use in controller
    req.quiz = quiz;
    next();
  } catch (error) {
    logger.error('Quiz validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Quiz validation failed'
    });
  }
};

export const validateQuizSubmission = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { quizId, answers } = req.body;
    const userId = req.user?.id;

    // Check if there's an active attempt
    const activeAttempt = await prisma.quizAttempt.findFirst({
      where: {
        userId,
        quizId,
        isCompleted: false
      }
    });

    if (!activeAttempt) {
      res.status(400).json({
        success: false,
        message: 'No active quiz attempt found'
      });
      return;
    }

    // Check if submission is within time limit
    const timeSinceStart = new Date().getTime() - activeAttempt.startedAt.getTime();
    const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
    
    if (quiz && timeSinceStart > (quiz.duration * 60 * 1000) + 30000) { // 30 seconds grace period
      res.status(400).json({
        success: false,
        message: 'Quiz submission time has expired'
      });
      return;
    }

    // Validate answers format
    if (!answers || typeof answers !== 'object') {
      res.status(400).json({
        success: false,
        message: 'Invalid answers format'
      });
      return;
    }

    next();
  } catch (error) {
    logger.error('Quiz submission validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Quiz submission validation failed'
    });
  }
};
