import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';
import { hashPassword } from '../utils/password';
import { logger } from '../config/logger';
import crypto from 'crypto';

// Student Management
export const createStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { email, full_name, phone_number, batch_id, course_id, address, emergency_contact } = req.body;
    
    // Generate random password
    const randomPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await hashPassword(randomPassword);
    
    // Create user
    const student = await prisma.user.create({
      data: {
        email,
        full_name,
        phone_number,
        password: hashedPassword,
        role: 'STUDENT',
        student_profile: {
          create: {
            batch_id: batch_id ? parseInt(batch_id, 10) : undefined,
            course_id: course_id ? parseInt(course_id, 10) : undefined,
            address,
            emergency_contact
          }
        }
      },
      include: {
        student_profile: {
          include: {
            batch: true,
            course: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: { ...student, tempPassword: randomPassword }
    });
  } catch (error) {
    logger.error('Create student error:', error);
    res.status(500).json({ success: false, message: 'Failed to create student' });
  }
};

export const getStudents = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search, batch_id, course_id } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = { role: 'STUDENT' };
    
    if (search) {
      where.OR = [
        { full_name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (batch_id || course_id) {
      where.student_profile = {};
      if (batch_id) where.student_profile.batch_id = parseInt(batch_id as string);
      if (course_id) where.student_profile.course_id = parseInt(course_id as string);
    }

    const [students, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        include: {
          student_profile: {
            include: {
              batch: true,
              course: true
            }
          }
        },
        orderBy: { created_at: 'desc' }
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
    const studentId = parseInt(id);

    if (isNaN(studentId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid student ID'
      });
      return;
    }

    const { full_name, phone_number, batch_id, course_id, address, emergency_contact, is_active } = req.body;

    const student = await prisma.user.update({
      where: { user_id: studentId },
      data: {
        full_name,
        phone_number,
        is_active,
        student_profile: {
          update: {
            batch_id,
            course_id,
            address,
            emergency_contact
          }
        }
      },
      include: {
        student_profile: {
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
    const studentId = parseInt(id);

    if (isNaN(studentId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid student ID'
      });
      return;
    }

    await prisma.user.delete({
      where: { user_id: studentId }
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

export const getCourses = async (_: AuthRequest, res: Response) => {
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
      orderBy: { created_at: 'desc' }
    });

    res.status(200).json({
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
    const courseId = parseInt(id);

    if (isNaN(courseId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid course ID'
      });
      return;
    }

    const { name, description, duration, fees, subjects, status } = req.body;

    const course = await prisma.course.update({
      where: { course_id: courseId },
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
    const courseId = parseInt(id);

    if (isNaN(courseId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid course ID'
      });
      return;
    }

    await prisma.course.delete({
      where: { course_id: courseId }
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
    const { batch_name, timing, capacity, course_id, start_date, end_date, description } = req.body;

    const batch = await prisma.batch.create({
      data: {
        batch_name,
        timing,
        capacity,
        course_id,
        start_date,
        end_date,
        description
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
    const { course_id } = req.query;
    const where = course_id ? { course_id: parseInt(course_id as string) } : undefined;

    const batches = await prisma.batch.findMany({
      where,
      include: {
        course: true,
        students: true
      },
      orderBy: { created_at: 'desc' }
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
    const { email, full_name, phone_number, department, designation, qualifications, specialization, subjects } = req.body;
    
    // Generate random password
    const randomPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await hashPassword(randomPassword);
    
    const staff = await prisma.user.create({
      data: {
        email,
        full_name,
        phone_number,
        password: hashedPassword,
        role: 'TEACHER',
        staff: {
          create: {
            department,
            designation,
            qualifications,
            specialization,
            subjects
          }
        }
      },
      include: {
        staff: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Staff created successfully',
      data: { ...staff, tempPassword: randomPassword }
    });
  } catch (error) {
    logger.error('Create staff error:', error);
    res.status(500).json({ success: false, message: 'Failed to create staff' });
  }
};

export const getStaff = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = { role: 'TEACHER' };
    
    if (search) {
      where.OR = [
        { full_name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [staff, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        include: {
          staff: true
        },
        orderBy: { created_at: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      data: staff,
      meta: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
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
