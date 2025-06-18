import { Request, Response } from 'express';
import { body } from 'express-validator';
import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { logger } from '../config/logger';
import { AuthRequest, ApiResponse } from '../types';

export const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('full_name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('role').optional().isIn(['STUDENT', 'ADMIN']).withMessage('Invalid role')
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, full_name, phone_number, role = 'STUDENT' } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone_number: phone_number || undefined }
        ]
      }
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User already exists with this email or phone'
      });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        full_name,
        phone_number,
        role,
        student_profile: role === 'STUDENT' ? {
          create: {}
        } : undefined
      },
      include: {
        student_profile: true
      }
    });

    const token = generateToken(user);

    const response: ApiResponse = {
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          user_id: user.user_id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          avatar: user.avatar
        },
        token
      }
    };

    logger.info(`User registered: ${user.email}`);
    res.status(201).json(response);
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        student_profile: {
          include: {
            batch: true,
            course: true
          }
        }
      }
    });

    if (!user || !user.is_active) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials or inactive account'
      });
      return;
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    const token = generateToken(user);

    const response: ApiResponse = {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          user_id: user.user_id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          avatar: user.avatar,
          student_profile: user.student_profile
        },
        token
      }
    };

    logger.info(`User logged in: ${user.email}`);
    res.json(response);
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: req.user!.user_id },
      include: {
        student_profile: {
          include: {
            batch: true,
            course: true
          }
        }
      }
    });

    const response: ApiResponse = {
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user_id: user!.user_id,
        email: user!.email,
        full_name: user!.full_name,
        phone_number: user!.phone_number,
        role: user!.role,
        avatar: user!.avatar,
        student_profile: user!.student_profile
      }
    };

    res.json(response);
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
