import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';
import { logger } from '../config/logger';
import type { Prisma, QuestionType, DifficultyLevel } from '@prisma/client';

// Get Questions from Question Bank
export const getQuestions = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      subject, 
      topic, 
      difficulty, 
      type 
    } = req.query;
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: Prisma.QuestionWhereInput = {};
    
    if (search) {
      where.OR = [
        { question_text: { contains: search as string, mode: 'insensitive' } },
        { topic: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (subject) where.subject_id = parseInt(subject as string);
    if (topic) where.topic = topic as string;
    if (difficulty) where.difficulty = difficulty as DifficultyLevel;
    if (type) where.type = type as QuestionType;

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { created_at: 'desc' }
      }),
      prisma.question.count({ where })
    ]);

    res.json({
      success: true,
      data: questions,
      meta: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    logger.error('Get questions error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch questions' });
  }
};

// Create Question
export const createQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const {
      question_text,
      type,
      subject_id,
      topic,
      difficulty,
      options,
      correct_answer,
      explanation,
      marks
    } = req.body;

    const newQuestion = await prisma.question.create({
      data: {
        question_text,
        type,
        subject_id,
        topic,
        difficulty,
        options,
        correct_answer,
        explanation,
        marks: marks || 1
      }
    });

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: newQuestion
    });
  } catch (error) {
    logger.error('Create question error:', error);
    res.status(500).json({ success: false, message: 'Failed to create question' });
  }
};

// Update Question
export const updateQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const questionId = parseInt(id);

    if (isNaN(questionId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid question ID'
      });
      return;
    }

    const question = await prisma.question.update({
      where: { question_id: questionId },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Question updated successfully',
      data: question
    });
  } catch (error) {
    logger.error('Update question error:', error);
    res.status(500).json({ success: false, message: 'Failed to update question' });
  }
};

// Delete Question
export const deleteQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const questionId = parseInt(id);

    if (isNaN(questionId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid question ID'
      });
      return;
    }

    // Check if question is used in any quiz
    const quizQuestion = await prisma.quizQuestion.findFirst({
      where: { question_id: questionId }
    });

    if (quizQuestion) {
      res.status(400).json({
        success: false,
        message: 'Cannot delete question as it is used in tests'
      });
      return;
    }

    await prisma.question.delete({
      where: { question_id: questionId }
    });

    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    logger.error('Delete question error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete question' });
  }
};

// Get Question by ID
export const getQuestionById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const questionId = parseInt(id);

    if (isNaN(questionId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid question ID'
      });
      return;
    }

    const question = await prisma.question.findUnique({
      where: { question_id: questionId }
    });

    if (!question) {
      res.status(404).json({
        success: false,
        message: 'Question not found'
      });
      return;
    }

    res.json({
      success: true,
      data: question
    });
  } catch (error) {
    logger.error('Get question by ID error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch question' });
  }
};

// Bulk Import Questions
export const bulkImportQuestions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Questions array is required'
      });
      return;
    }

    const createdQuestions = await prisma.question.createMany({
      data: questions.map(q => ({
        question_text: q.question_text,
        type: q.type,
        subject_id: q.subject_id,
        topic: q.topic,
        difficulty: q.difficulty,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        marks: q.marks || 1
      })),
      skipDuplicates: true
    });

    res.json({
      success: true,
      message: `${createdQuestions.count} questions imported successfully`,
      data: { count: createdQuestions.count }
    });
  } catch (error) {
    logger.error('Bulk import questions error:', error);
    res.status(500).json({ success: false, message: 'Failed to import questions' });
  }
};
