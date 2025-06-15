import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';
import { hashPassword } from '../utils/password';
import { logger } from '../config/logger';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Student Management
export const createStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { email, name, phone, batchId, courseId, address, emergencyContact } = req.body;
    
    // Generate random password
    const randomPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await hashPassword(randomPassword);
    
    // Create user
    const student = await prisma.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
        role: 'STUDENT',
        studentProfile: {
          create: {
            batchId,
            courseId,
            address,
            emergencyContact
          }
        }
      },
      include: {
        studentProfile: {
          include: {
            batch: true,
            course: true
          }
        }
      }
    });

    // Send email with credentials
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Welcome to AVP Academy - Your Login Credentials',
      html: `
        <h2>Welcome to AVP Academy!</h2>
        <p>Dear ${name},</p>
        <p>Your account has been created successfully.</p>
        <p><strong>Login Credentials:</strong></p>
        <p>Email: ${email}</p>
        <p>Password: ${randomPassword}</p>
        <p>Please change your password after first login.</p>
        <p>Best regards,<br>AVP Academy Team</p>
      `
    });

    res.status(201).json({
      success: true,
      message: 'Student created and credentials sent via email',
      data: student
    });
  } catch (error) {
    logger.error('Create student error:', error);
    res.status(500).json({ success: false, message: 'Failed to create student' });
  }
};

export const getStudents = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search, batchId, courseId } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = { role: 'STUDENT' };
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (batchId || courseId) {
      where.studentProfile = {};
      if (batchId) where.studentProfile.batchId = batchId;
      if (courseId) where.studentProfile.courseId = courseId;
    }

    const [students, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        include: {
          studentProfile: {
            include: {
              batch: true,
              course: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      data: students,
      meta: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    logger.error('Get students error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch students' });
  }
};

export const updateStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, phone, batchId, courseId, address, emergencyContact, isActive } = req.body;

    const student = await prisma.user.update({
      where: { id },
      data: {
        name,
        phone,
        isActive,
        studentProfile: {
          update: {
            batchId,
            courseId,
            address,
            emergencyContact
          }
        }
      },
      include: {
        studentProfile: {
          include: {
            batch: true,
            course: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    logger.error('Update student error:', error);
    res.status(500).json({ success: false, message: 'Failed to update student' });
  }
};

export const deleteStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    logger.error('Delete student error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete student' });
  }
};

// Course Management
export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, duration, fees, subjects } = req.body;

    const course = await prisma.course.create({
      data: {
        name,
        description,
        duration,
        fees,
        subjects,
        status: 'DRAFT'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    logger.error('Create course error:', error);
    res.status(500).json({ success: false, message: 'Failed to create course' });
  }
};

export const getCourses = async (req: AuthRequest, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        batches: true,
        students: true,
        _count: {
          select: {
            students: true,
            batches: true,
            videos: true,
            quizzes: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    logger.error('Get courses error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch courses' });
  }
};

export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, duration, fees, subjects, status } = req.body;

    const course = await prisma.course.update({
      where: { id },
      data: {
        name,
        description,
        duration,
        fees,
        subjects,
        status
      }
    });

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    logger.error('Update course error:', error);
    res.status(500).json({ success: false, message: 'Failed to update course' });
  }
};

export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.course.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    logger.error('Delete course error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete course' });
  }
};

// Batch Management
export const createBatch = async (req: AuthRequest, res: Response) => {
  try {
    const { name, timing, capacity, courseId } = req.body;

    const batch = await prisma.batch.create({
      data: {
        name,
        timing,
        capacity,
        courseId
      },
      include: {
        course: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Batch created successfully',
      data: batch
    });
  } catch (error) {
    logger.error('Create batch error:', error);
    res.status(500).json({ success: false, message: 'Failed to create batch' });
  }
};

export const getBatches = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.query;
    const where = courseId ? { courseId: courseId as string } : {};

    const batches = await prisma.batch.findMany({
      where,
      include: {
        course: true,
        students: true,
        _count: {
          select: {
            students: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: batches
    });
  } catch (error) {
    logger.error('Get batches error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch batches' });
  }
};

// Staff Management
export const createStaff = async (req: AuthRequest, res: Response) => {
  try {
    const { email, name, phone, role } = req.body;
    
    const randomPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await hashPassword(randomPassword);
    
    const staff = await prisma.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
        role: role || 'TEACHER'
      }
    });

    // Send email with credentials
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'AVP Academy - Staff Account Created',
      html: `
        <h2>Welcome to AVP Academy Team!</h2>
        <p>Dear ${name},</p>
        <p>Your staff account has been created.</p>
        <p><strong>Login Credentials:</strong></p>
        <p>Email: ${email}</p>
        <p>Password: ${randomPassword}</p>
        <p>Role: ${role}</p>
        <p>Please change your password after first login.</p>
      `
    });

    res.status(201).json({
      success: true,
      message: 'Staff created and credentials sent via email',
      data: staff
    });
  } catch (error) {
    logger.error('Create staff error:', error);
    res.status(500).json({ success: false, message: 'Failed to create staff' });
  }
};

export const getStaff = async (res: Response) => {
  try {
    const staff = await prisma.user.findMany({
      where: {
        role: { in: ['ADMIN', 'TEACHER'] }
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: staff
    });
  } catch (error) {
    logger.error('Get staff error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch staff' });
  }
};

// Admin Settings
export const getAdminSettings = async (res: Response) => {
  try {
    // Return system settings (can be stored in database or config)
    const settings = {
      siteName: 'AVP Academy',
      maxVideoDownloads: 5,
      videoExpiryDays: 7,
      negativeMarkingEnabled: true,
      sessionTimeout: 30, // minutes
      maxConcurrentSessions: 1
    };

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    logger.error('Get admin settings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
};
