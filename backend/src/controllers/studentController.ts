
import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';
import { logger } from '../config/logger';
import { hashPassword } from '../utils/password';

// Student Dashboard
export const getStudentDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const student = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: {
          include: {
            batch: true,
            course: true
          }
        }
      }
    });

    // Get student stats
    const [videosWatched, testsCompleted, totalVideos, activeTests] = await Promise.all([
      prisma.videoDownload.count({ where: { userId } }),
      prisma.quizAttempt.count({ where: { userId, isCompleted: true } }),
      prisma.video.count({ 
        where: { 
          courseId: student?.studentProfile?.courseId,
          isPublished: true 
        } 
      }),
      prisma.quiz.count({ 
        where: { 
          courseId: student?.studentProfile?.courseId,
          isPublished: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
          ]
        } 
      })
    ]);

    // Get recent activities
    const recentVideos = await prisma.video.findMany({
      where: { 
        courseId: student?.studentProfile?.courseId,
        isPublished: true 
      },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    const upcomingTests = await prisma.quiz.findMany({
      where: {
        courseId: student?.studentProfile?.courseId,
        isPublished: true,
        scheduledAt: { gt: new Date() }
      },
      take: 5,
      orderBy: { scheduledAt: 'asc' }
    });

    res.json({
      success: true,
      data: {
        student,
        stats: {
          videosWatched,
          testsCompleted,
          totalVideos,
          activeTests
        },
        recentVideos,
        upcomingTests
      }
    });
  } catch (error) {
    logger.error('Get student dashboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
  }
};

// Get Student Profile
export const getStudentProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const student = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: {
          include: {
            batch: true,
            course: true
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        createdAt: true,
        studentProfile: true
      }
    });

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    logger.error('Get student profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};

// Update Student Profile
export const updateStudentProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, phone, address, emergencyContact, bio } = req.body;

    const student = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        studentProfile: {
          update: {
            address,
            emergencyContact,
            bio
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
      message: 'Profile updated successfully',
      data: student
    });
  } catch (error) {
    logger.error('Update student profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

// Change Password
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);

    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Failed to change password' });
  }
};

// Get Student Videos (based on batch/course)
export const getStudentVideos = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { subject, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const student = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true
      }
    });

    const where: any = {
      courseId: student?.studentProfile?.courseId,
      isPublished: true
    };

    if (subject) {
      where.subject = subject;
    }

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.video.count({ where })
    ]);

    res.json({
      success: true,
      data: videos,
      meta: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    logger.error('Get student videos error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch videos' });
  }
};

// Get Student Study Materials
export const getStudentMaterials = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { subject, type, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const student = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true
      }
    });

    const where: any = {
      courseId: student?.studentProfile?.courseId,
      isPublished: true
    };

    if (subject) where.subject = subject;
    if (type) where.type = type;

    const [materials, total] = await Promise.all([
      prisma.studyMaterial.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.studyMaterial.count({ where })
    ]);

    res.json({
      success: true,
      data: materials,
      meta: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    logger.error('Get student materials error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch study materials' });
  }
};
