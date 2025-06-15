
import { Response } from 'express';
import { body, query } from 'express-validator';
import { prisma } from '../config/database';
import { AuthRequest, ApiResponse, QuizSubmission, QuizAnswer } from '../types';
import { logger } from '../config/logger';

export const getQuizzesValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('subject').optional().isString(),
  query('type').optional().isIn(['PRACTICE', 'MOCK', 'DAILY', 'SUBJECT_WISE', 'CUSTOM'])
];

export const getQuizzes = async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '10', subject, type } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {
      isPublished: true
    };

    if (subject && subject !== 'all') {
      where.subject = subject;
    }

    if (type) {
      where.type = type;
    }

    // Filter by user's course if student
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      include: { studentProfile: true }
    });

    if (user?.role === 'STUDENT' && user.studentProfile?.courseId) {
      where.courseId = user.studentProfile.courseId;
    }

    const [quizzes, total] = await Promise.all([
      prisma.quiz.findMany({
        where,
        include: {
          course: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              questions: true,
              attempts: true
            }
          }
        },
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.quiz.count({ where })
    ]);

    const response: ApiResponse = {
      success: true,
      message: 'Quizzes retrieved successfully',
      data: quizzes.map(quiz => ({
        ...quiz,
        questionsCount: quiz._count.questions,
        attemptsCount: quiz._count.attempts
      })),
      meta: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    };

    res.json(response);
  } catch (error) {
    logger.error('Get quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getQuizById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const quizId = parseInt(id);

    if (isNaN(quizId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid quiz ID'
      });
      return;
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        course: {
          select: {
            id: true,
            name: true
          }
        },
        questions: {
          include: {
            question: {
              select: {
                id: true,
                question: true,
                type: true,
                options: true,
                marks: true,
                difficulty: true
              }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!quiz || !quiz.isPublished) {
      res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Quiz retrieved successfully',
      data: quiz
    };

    res.json(response);
  } catch (error) {
    logger.error('Get quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const submitQuizValidation = [
  body('quizId').isString().withMessage('Invalid quiz ID'),
  body('answers').isArray().withMessage('Answers must be an array'),
  body('answers.*.questionId').isString().withMessage('Invalid question ID'),
  body('answers.*.answer').notEmpty().withMessage('Answer is required'),
  body('totalTimeTaken').isInt({ min: 0 }).withMessage('Invalid time taken')
];

export const submitQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { quizId, answers, totalTimeTaken }: QuizSubmission = req.body;
    const userId = req.user!.id;
    const quizIdInt = parseInt(quizId);

    if (isNaN(quizIdInt)) {
      res.status(400).json({
        success: false,
        message: 'Invalid quiz ID'
      });
      return;
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizIdInt },
      include: {
        questions: {
          include: {
            question: true
          }
        }
      }
    });

    if (!quiz || !quiz.isPublished) {
      res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
      return;
    }

    // Check if user already attempted this quiz
    const existingAttempt = await prisma.quizAttempt.findFirst({
      where: {
        userId,
        quizId: quizIdInt,
        isCompleted: true
      }
    });

    if (existingAttempt) {
      res.status(400).json({
        success: false,
        message: 'Quiz already completed'
      });
      return;
    }

    // Calculate score
    let score = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;

    const answerMap = new Map(answers.map((a: QuizAnswer) => [a.questionId, a.answer]));

    for (const quizQuestion of quiz.questions) {
      const userAnswer = answerMap.get(quizQuestion.questionId.toString());
      const correctAnswer = quizQuestion.question.correctAnswer;

      if (userAnswer === correctAnswer) {
        score += quizQuestion.question.marks;
        correctAnswers++;
      } else if (userAnswer && quiz.negativeMarking && quiz.negativeMarks) {
        score -= quiz.negativeMarks;
        wrongAnswers++;
      } else if (userAnswer) {
        wrongAnswers++;
      }
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, score);

    // Create quiz attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId: quizIdInt,
        answers: JSON.stringify(answers),
        score,
        totalQuestions: quiz.questions.length,
        correctAnswers,
        wrongAnswers,
        timeTaken: totalTimeTaken,
        isCompleted: true,
        completedAt: new Date()
      }
    });

    // Update student profile stats
    await prisma.studentProfile.update({
      where: { userId },
      data: {
        totalScore: { increment: score },
        testsCompleted: { increment: 1 }
      }
    });

    const response: ApiResponse = {
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        attemptId: attempt.id,
        score,
        totalQuestions: quiz.questions.length,
        correctAnswers,
        wrongAnswers,
        percentage: Math.round((correctAnswers / quiz.questions.length) * 100),
        passed: score >= quiz.passingMarks
      }
    };

    res.json(response);
  } catch (error) {
    logger.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getQuizAttempts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { page = '1', limit = '10' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [attempts, total] = await Promise.all([
      prisma.quizAttempt.findMany({
        where: { userId, isCompleted: true },
        include: {
          quiz: {
            select: {
              id: true,
              title: true,
              subject: true,
              type: true,
              totalMarks: true
            }
          }
        },
        skip,
        take: parseInt(limit as string),
        orderBy: { completedAt: 'desc' }
      }),
      prisma.quizAttempt.count({ where: { userId, isCompleted: true } })
    ]);

    const response: ApiResponse = {
      success: true,
      message: 'Quiz attempts retrieved successfully',
      data: attempts,
      meta: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    };

    res.json(response);
  } catch (error) {
    logger.error('Get quiz attempts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
