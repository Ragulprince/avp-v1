
import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';
import { logger } from '../config/logger';

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

    const where: any = {};
    
    if (search) {
      where.OR = [
        { question: { contains: search as string, mode: 'insensitive' } },
        { topic: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (subject) where.subject = subject;
    if (topic) where.topic = topic;
    if (difficulty) where.difficulty = difficulty;
    if (type) where.type = type;

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' }
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
      question,
      type,
      subject,
      topic,
      difficulty,
      options,
      correctAnswer,
      explanation,
      marks
    } = req.body;

    const newQuestion = await prisma.question.create({
      data: {
        question,
        type,
        subject,
        topic,
        difficulty,
        options,
        correctAnswer,
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

    const question = await prisma.question.update({
      where: { id },
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
export const deleteQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if question is used in any quiz
    const quizQuestion = await prisma.quizQuestion.findFirst({
      where: { questionId: id }
    });

    if (quizQuestion) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete question as it is used in tests'
      });
    }

    await prisma.question.delete({
      where: { id }
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
export const getQuestionById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const question = await prisma.question.findUnique({
      where: { id }
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
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
export const bulkImportQuestions = async (req: AuthRequest, res: Response) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Questions array is required'
      });
    }

    const createdQuestions = await prisma.question.createMany({
      data: questions,
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
