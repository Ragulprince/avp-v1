import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';
import { logger } from '../config/logger';
import type { Prisma } from '@prisma/client';

// Test Creation with Configuration
export const createTest = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      course_id,
      subject_id,
      batch_id,
      time_limit_minutes,
      total_marks,
      passing_marks,
      has_negative_marking,
      negative_marks,
      scheduled_at,
      expires_at,
      start_time,
      end_time
    } = req.body;

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        course_id,
        subject_id,
        batch_id,
        time_limit_minutes,
        total_marks,
        passing_marks,
        has_negative_marking,
        negative_marks,
        scheduled_at,
        expires_at,
        start_time,
        end_time,
        is_published: false
      }
    });

    res.status(201).json({
      success: true,
      message: 'Test created successfully',
      data: {
        quiz_id: quiz.quiz_id,
        title: quiz.title
      }
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

    if (subject) where.subject_id = subject;
    if (type) where.type = type;
    if (courseId) where.course_id = courseId;

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
        orderBy: { created_at: 'desc' }
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
export const addQuestionToTest = async (req: AuthRequest, res: Response) => {
  try {
    const { testId } = req.params;
    const { questionId } = req.body;
    const testIdInt = parseInt(testId);
    const questionIdInt = parseInt(questionId);

    // Verify test exists
    const quiz = await prisma.quiz.findUnique({
      where: { quiz_id: testIdInt }
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    // Verify question exists
    const question = await prisma.question.findUnique({
      where: { question_id: questionIdInt }
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Check if question is already in test
    const existingQuestion = await prisma.quizQuestion.findFirst({
      where: { 
        quiz_id: testIdInt,
        question_id: questionIdInt
      }
    });

    if (existingQuestion) {
      return res.status(400).json({
        success: false,
        message: 'Question already exists in test'
      });
    }

    // Get the last question's order
    const lastQuestion = await prisma.quizQuestion.findFirst({
      where: { quiz_id: testIdInt },
      orderBy: { order: 'desc' }
    });

    const nextOrder = lastQuestion?.order ? lastQuestion.order + 1 : 1;

    // Add question to test
    await prisma.quizQuestion.create({
      data: {
        quiz_id: testIdInt,
        question_id: question.question_id,
        order: nextOrder
      }
    });

    return res.json({
      success: true,
      message: 'Question added to test successfully'
    });
  } catch (error) {
    logger.error('Add question to test error:', error);
    return res.status(500).json({ success: false, message: 'Failed to add question to test' });
  }
};

// Test Reports - Test-wise
export const getTestReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { testId } = req.params;
    const testIdInt = parseInt(testId);

    if (isNaN(testIdInt)) {
      res.status(400).json({
        success: false,
        message: 'Invalid test ID'
      });
      return;
    }

    const test = await prisma.quiz.findUnique({
      where: { quiz_id: testIdInt },
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
                user_id: true,
                full_name: true,
                email: true
              }
            }
          },
          orderBy: { score: 'desc' }
        }
      }
    }) as (Prisma.QuizGetPayload<{ include: { questions: { include: { question: true } }, attempts: { include: { user: { select: { user_id: true, full_name: true, email: true } } } } } }> | null);

    if (!test) {
      res.status(404).json({
        success: false,
        message: 'Test not found'
      });
      return;
    }

    // Calculate analytics
    const totalAttempts = test.attempts.length;
    const completedAttempts = test.attempts.filter((a: any) => a.is_completed).length;
    const averageScore = totalAttempts > 0 
      ? test.attempts.reduce((sum: number, a: any) => sum + a.score, 0) / totalAttempts 
      : 0;
    const passRate = totalAttempts > 0 
      ? (test.attempts.filter((a: any) => a.score >= (test.passing_marks ?? 0)).length  / totalAttempts) * 100 
      : 0;

    // Question-wise analysis
    const questionAnalysis = test.questions.map((q: any) => {
      const correctCount = test.attempts.filter((attempt: any) => {
        const answers = attempt.answers as any;
        return answers[q.question_id] === q.question.correct_answer;
      }).length;
      
      return {
        question_id: q.question_id,
        question_text: q.question.question_text,
        topic: q.question.topic,
        difficulty: q.question.difficulty,
        correct_answers: correctCount,
        incorrect_answers: totalAttempts - correctCount,
        accuracy: totalAttempts > 0 ? (correctCount / totalAttempts) * 100 : 0
      };
    });

    res.json({
      success: true,
      data: {
        test_id: test.quiz_id,
        title: test.title,
        description: test.description,
        course_id: test.course_id,
        subject_id: test.subject_id,
        batch_id: test.batch_id,
        time_limit_minutes: test.time_limit_minutes,
        total_marks: test.total_marks,
        passing_marks: test.passing_marks,
        has_negative_marking: test.has_negative_marking,
        negative_marks: test.negative_marks,
        is_published: test.is_published,
        scheduled_at: test.scheduled_at,
        expires_at: test.expires_at,
        start_time: test.start_time,
        end_time: test.end_time,
        created_at: test.created_at,
        updated_at: test.updated_at,
        statistics: {
          total_attempts: totalAttempts,
          completed_attempts: completedAttempts,
          average_score: averageScore,
          pass_rate: passRate
        },
        question_analysis: questionAnalysis,
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
    const studentIdInt = parseInt(studentId);
    const testIdInt = parseInt(testId);

    if (isNaN(studentIdInt) || isNaN(testIdInt)) {
      res.status(400).json({
        success: false,
        message: 'Invalid student ID or test ID'
      });
      return;
    }

    const attempt = await prisma.quizAttempt.findFirst({
      where: {
        user_id: studentIdInt,
        quiz_id: testIdInt
      },
      include: {
        user: {
          select: {
            user_id: true,
            full_name: true,
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
    const questionAnalysis = attempt.quiz.questions.map((q: any) => {
      const studentAnswer = answers[q.question_id];
      const isCorrect = studentAnswer === q.question.correct_answer;
      
      return {
        question_id: q.question_id,
        question_text: q.question.question_text,
        options: q.question.options,
        correct_answer: q.question.correct_answer,
        student_answer: studentAnswer,
        is_correct: isCorrect,
        marks: isCorrect ? q.question.marks : (attempt.quiz.has_negative_marking ? -(attempt.quiz.negative_marks || 0) : 0),
        topic: q.question.topic,
        difficulty: q.question.difficulty,
        explanation: q.question.explanation
      };
    });

    res.json({
      success: true,
      data: {
        attempt_id: attempt.attempt_id,
        user: attempt.user,
        start_time: attempt.start_time,
        submit_time: attempt.submit_time,
        score: attempt.score,
        total_questions: attempt.total_questions,
        correct_answers: attempt.correct_answers,
        wrong_answers: attempt.wrong_answers,
        unattempted: attempt.unattempted,
        accuracy: attempt.accuracy,
        percentage: attempt.score ? (attempt.score / (attempt.quiz.total_marks || 0)) * 100 : 0,
        time_taken: attempt.time_taken,
        rank: await getStudentRank(testIdInt, attempt.score ?? 0),
        question_analysis: questionAnalysis
      }
    });
  } catch (error) {
    logger.error('Get student test report error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch student test report' });
  }
};

// Helper function to get student rank
async function getStudentRank(quiz_id: number, score: number): Promise<number> {
  const higherScores = await prisma.quizAttempt.count({
    where: {
      quiz_id,
      score: { gt: score }
    }
  });
  
  return higherScores + 1;
}

// Publish/Unpublish Test
export const toggleTestPublish = async (req: AuthRequest, res: Response) => {
  try {
    const { testId } = req.params;
    const { is_published } = req.body;
    const testIdInt = parseInt(testId);

    if (isNaN(testIdInt)) {
      res.status(400).json({
        success: false,
        message: 'Invalid test ID'
      });
      return;
    }

    const test = await prisma.quiz.update({
      where: { quiz_id: testIdInt },
      data: { is_published }
    });

    res.json({
      success: true,
      message: `Test ${is_published ? 'published' : 'unpublished'} successfully`,
      data: {
        test_id: test.quiz_id,
        is_published: test.is_published
      }
    });
  } catch (error) {
    logger.error('Toggle test publish error:', error);
    res.status(500).json({ success: false, message: 'Failed to update test status' });
  }
};

export const getTestDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { testId } = req.params;
    const testIdInt = parseInt(testId);
    const test = await prisma.quiz.findUnique({
      where: { quiz_id: testIdInt },
      include: {
        questions: { include: { question: true } },
        attempts: {
          include: {
            user: { select: { user_id: true, full_name: true, email: true } }
          }
        }
      }
    }) as (Prisma.QuizGetPayload<{ include: { questions: { include: { question: true } }, attempts: { include: { user: { select: { user_id: true, full_name: true, email: true } } } } } }> | null);
    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }
    const totalAttempts = test.attempts?.length || 0;
    const completedAttempts = test.attempts?.filter(a => a.is_completed).length || 0;
    const averageScore = totalAttempts > 0
      ? test.attempts?.reduce((sum, a) => sum + (a.score ?? 0), 0) / totalAttempts
      : 0;
    const passPercentage = totalAttempts > 0
      ? (test.attempts.filter((a: any) => a.score != null && a.score >= (test.passing_marks ?? 0)).length / totalAttempts) * 100
      : 0;
    const questionAnalysis = test.questions?.map(q => {
      const correctCount = test.attempts?.filter(attempt => {
        const answer = attempt.answers as any;
        return answer && answer[q.question.question_id] === q.question.correct_answer;
      }).length || 0;
      return {
        question_id: q.question.question_id,
        question_text: q.question.question_text,
        correct_answers: correctCount,
        total_attempts: totalAttempts,
        accuracy: totalAttempts > 0 ? (correctCount / totalAttempts) * 100 : 0
      };
    }) || [];
    return res.json({
      success: true,
      data: {
        test_id: test.quiz_id,
        title: test.title,
        description: test.description,
        course_id: test.course_id,
        subject_id: test.subject_id,
        batch_id: test.batch_id,
        time_limit_minutes: test.time_limit_minutes,
        total_marks: test.total_marks,
        passing_marks: test.passing_marks,
        has_negative_marking: test.has_negative_marking,
        negative_marks: test.negative_marks,
        is_published: test.is_published,
        scheduled_at: test.scheduled_at,
        expires_at: test.expires_at,
        start_time: test.start_time,
        end_time: test.end_time,
        created_at: test.created_at,
        updated_at: test.updated_at,
        statistics: {
          total_attempts: totalAttempts,
          completed_attempts: completedAttempts,
          average_score: averageScore,
          pass_percentage: passPercentage
        },
        question_analysis: questionAnalysis,
        attempts: test.attempts || []
      }
    });
  } catch (error) {
    logger.error('Get test details error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch test details' });
  }
};

export const getStudentAttempts = async (req: AuthRequest, res: Response) => {
  try {
    const { testId } = req.params;
    const { studentId } = req.query;
    const testIdInt = parseInt(testId);
    const studentIdInt = parseInt(studentId as string);
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        user_id: studentIdInt,
        quiz_id: testIdInt
      },
      include: {
        user: { select: { user_id: true, full_name: true, email: true } },
        quiz: {
          include: {
            questions: { include: { question: true } }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });
    const formattedAttempts = await Promise.all(attempts.map(async (attempt: any) => {
      const questionAnalysis = attempt.quiz?.questions.map((q: any) => {
        const answer = attempt.answers as any;
        const isCorrect = answer && answer[q.question.question_id] === q.question.correct_answer;
        return {
          question_id: q.question.question_id,
          question_text: q.question.question_text,
          user_answer: answer ? answer[q.question.question_id] : null,
          correct_answer: q.question.correct_answer,
          is_correct: isCorrect,
          marks: isCorrect ? q.question.marks : (attempt.quiz?.has_negative_marking ? -(attempt.quiz?.negative_marks ?? 0) : 0)
        };
      }) || [];
      return {
        attempt_id: attempt.attempt_id,
        user: attempt.user,
        start_time: attempt.start_time,
        submit_time: attempt.submit_time,
        score: attempt.score,
        total_questions: attempt.total_questions,
        correct_answers: attempt.correct_answers,
        wrong_answers: attempt.wrong_answers,
        unattempted: attempt.unattempted,
        accuracy: attempt.accuracy,
        percentage: attempt.score ? (attempt.score / (attempt.quiz?.total_marks ?? 0)) * 100 : 0,
        time_taken: attempt.time_taken,
        rank: await getStudentRank(testIdInt, attempt.score ?? 0),
        question_analysis: questionAnalysis
      };
    }));
    return res.json({ success: true, data: formattedAttempts });
  } catch (error) {
    logger.error('Get student attempts error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch student attempts' });
  }
};
