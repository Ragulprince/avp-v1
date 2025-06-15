
import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';
import { logger } from '../config/logger';

// Test Creation with Configuration
export const createTest = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      subject,
      type,
      duration,
      totalMarks,
      passingMarks,
      negativeMarking,
      negativeMarks,
      courseId,
      scheduledAt,
      expiresAt,
      questions
    } = req.body;

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        subject,
        type,
        duration,
        totalMarks,
        passingMarks,
        negativeMarking,
        negativeMarks,
        courseId,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isPublished: false
      }
    });

    // Add questions to quiz
    if (questions && questions.length > 0) {
      const quizQuestions = questions.map((q: any, index: number) => ({
        quizId: quiz.id,
        questionId: q.questionId || q.id,
        order: index + 1
      }));

      await prisma.quizQuestion.createMany({
        data: quizQuestions
      });
    }

    const completeQuiz = await prisma.quiz.findUnique({
      where: { id: quiz.id },
      include: {
        questions: {
          include: {
            question: true
          },
          orderBy: { order: 'asc' }
        },
        course: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Test created successfully',
      data: completeQuiz
    });
  } catch (error) {
    logger.error('Create test error:', error);
    res.status(500).json({ success: false, message: 'Failed to create test' });
  }
};

// Get Tests for Admin
export const getTests = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search, subject, type, courseId } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (subject) where.subject = subject;
    if (type) where.type = type;
    if (courseId) where.courseId = courseId;

    const [tests, total] = await Promise.all([
      prisma.quiz.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        include: {
          course: true,
          questions: {
            include: {
              question: true
            }
          },
          attempts: true,
          _count: {
            select: {
              questions: true,
              attempts: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.quiz.count({ where })
    ]);

    res.json({
      success: true,
      data: tests,
      meta: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    logger.error('Get tests error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tests' });
  }
};

// Add Question to Test (Manual or from Question Bank)
export const addQuestionToTest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { testId } = req.params;
    const { questionId, questionData } = req.body;

    let question;
    
    if (questionId) {
      // Adding from question bank
      question = await prisma.question.findUnique({
        where: { id: questionId }
      });
      
      if (!question) {
        res.status(404).json({
          success: false,
          message: 'Question not found in question bank'
        });
        return;
      }
    } else if (questionData) {
      // Creating new question manually
      question = await prisma.question.create({
        data: {
          question: questionData.question,
          type: questionData.type,
          subject: questionData.subject,
          topic: questionData.topic,
          difficulty: questionData.difficulty,
          options: questionData.options,
          correctAnswer: questionData.correctAnswer,
          explanation: questionData.explanation,
          marks: questionData.marks || 1
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Either questionId or questionData is required'
      });
      return;
    }

    // Get next order number
    const lastQuestion = await prisma.quizQuestion.findFirst({
      where: { quizId: testId },
      orderBy: { order: 'desc' }
    });

    const nextOrder = lastQuestion ? lastQuestion.order + 1 : 1;

    // Add question to quiz
    await prisma.quizQuestion.create({
      data: {
        quizId: testId,
        questionId: question.id,
        order: nextOrder
      }
    });

    res.json({
      success: true,
      message: 'Question added to test successfully',
      data: question
    });
  } catch (error) {
    logger.error('Add question to test error:', error);
    res.status(500).json({ success: false, message: 'Failed to add question to test' });
  }
};

// Test Reports - Test-wise
export const getTestReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { testId } = req.params;

    const test = await prisma.quiz.findUnique({
      where: { id: testId },
      include: {
        course: true,
        questions: {
          include: {
            question: true
          },
          orderBy: { order: 'asc' }
        },
        attempts: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { score: 'desc' }
        }
      }
    });

    if (!test) {
      res.status(404).json({
        success: false,
        message: 'Test not found'
      });
      return;
    }

    // Calculate analytics
    const totalAttempts = test.attempts.length;
    const completedAttempts = test.attempts.filter(a => a.isCompleted).length;
    const averageScore = totalAttempts > 0 
      ? test.attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts 
      : 0;
    const passRate = totalAttempts > 0 
      ? (test.attempts.filter(a => a.score >= test.passingMarks).length / totalAttempts) * 100 
      : 0;

    // Question-wise analysis
    const questionAnalysis = test.questions.map(q => {
      const correctCount = test.attempts.filter(attempt => {
        const answers = attempt.answers as any;
        return answers[q.questionId] === q.question.correctAnswer;
      }).length;
      
      return {
        questionId: q.questionId,
        question: q.question.question,
        topic: q.question.topic,
        difficulty: q.question.difficulty,
        correctAnswers: correctCount,
        incorrectAnswers: totalAttempts - correctCount,
        accuracy: totalAttempts > 0 ? (correctCount / totalAttempts) * 100 : 0
      };
    });

    res.json({
      success: true,
      data: {
        test,
        analytics: {
          totalAttempts,
          completedAttempts,
          averageScore: Math.round(averageScore * 100) / 100,
          passRate: Math.round(passRate * 100) / 100
        },
        questionAnalysis,
        attempts: test.attempts
      }
    });
  } catch (error) {
    logger.error('Get test report error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch test report' });
  }
};

// Student-wise Test Report
export const getStudentTestReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { studentId, testId } = req.params;

    const attempt = await prisma.quizAttempt.findFirst({
      where: {
        userId: studentId,
        quizId: testId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        quiz: {
          include: {
            questions: {
              include: {
                question: true
              },
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });

    if (!attempt) {
      res.status(404).json({
        success: false,
        message: 'Test attempt not found'
      });
      return;
    }

    // Question-wise analysis
    const answers = attempt.answers as any;
    const questionAnalysis = attempt.quiz.questions.map(q => {
      const studentAnswer = answers[q.questionId];
      const isCorrect = studentAnswer === q.question.correctAnswer;
      
      return {
        questionId: q.questionId,
        question: q.question.question,
        options: q.question.options,
        correctAnswer: q.question.correctAnswer,
        studentAnswer,
        isCorrect,
        marks: isCorrect ? q.question.marks : (attempt.quiz.negativeMarking ? -attempt.quiz.negativeMarks! : 0),
        topic: q.question.topic,
        difficulty: q.question.difficulty,
        explanation: q.question.explanation
      };
    });

    res.json({
      success: true,
      data: {
        attempt,
        questionAnalysis,
        summary: {
          totalQuestions: attempt.totalQuestions,
          correctAnswers: attempt.correctAnswers,
          wrongAnswers: attempt.wrongAnswers,
          score: attempt.score,
          percentage: (attempt.score / attempt.quiz.totalMarks) * 100,
          timeTaken: attempt.timeTaken,
          rank: await getStudentRank(testId, attempt.score)
        }
      }
    });
  } catch (error) {
    logger.error('Get student test report error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch student test report' });
  }
};

// Helper function to get student rank
async function getStudentRank(quizId: string, score: number): Promise<number> {
  const higherScores = await prisma.quizAttempt.count({
    where: {
      quizId,
      score: { gt: score }
    }
  });
  
  return higherScores + 1;
}

// Publish/Unpublish Test
export const toggleTestPublish = async (req: AuthRequest, res: Response) => {
  try {
    const { testId } = req.params;
    const { isPublished } = req.body;

    const test = await prisma.quiz.update({
      where: { id: testId },
      data: { isPublished }
    });

    res.json({
      success: true,
      message: `Test ${isPublished ? 'published' : 'unpublished'} successfully`,
      data: test
    });
  } catch (error) {
    logger.error('Toggle test publish error:', error);
    res.status(500).json({ success: false, message: 'Failed to update test status' });
  }
};
