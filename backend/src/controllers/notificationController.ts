
import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';
import { logger } from '../config/logger';

// Create Notification
export const createNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { title, message, type, userId, data } = req.body;

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type,
        userId,
        data
      }
    });

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification
    });
  } catch (error) {
    logger.error('Create notification error:', error);
    res.status(500).json({ success: false, message: 'Failed to create notification' });
  }
};

// Broadcast Notification to All Students
export const broadcastNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { title, message, type, data } = req.body;

    // Get all active students
    const students = await prisma.user.findMany({
      where: { 
        role: 'STUDENT',
        isActive: true 
      },
      select: { id: true }
    });

    // Create notifications for all students
    const notifications = students.map(student => ({
      title,
      message,
      type,
      userId: student.id,
      data
    }));

    await prisma.notification.createMany({
      data: notifications
    });

    res.json({
      success: true,
      message: `Notification sent to ${students.length} students`,
      data: { sentTo: students.length }
    });
  } catch (error) {
    logger.error('Broadcast notification error:', error);
    res.status(500).json({ success: false, message: 'Failed to broadcast notification' });
  }
};

// Get Notifications for User
export const getUserNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 20, isRead } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {
      OR: [
        { userId },
        { userId: null } // Global notifications
      ]
    };

    if (isRead !== undefined) {
      where.isRead = isRead === 'true';
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.notification.count({ where })
    ]);

    res.json({
      success: true,
      data: notifications,
      meta: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    logger.error('Get user notifications error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

// Mark Notification as Read
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const notificationId = parseInt(id);

    if (isNaN(notificationId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid notification ID'
      });
      return;
    }

    const notification = await prisma.notification.update({
      where: { 
        id: notificationId,
        OR: [
          { userId },
          { userId: null }
        ]
      },
      data: { isRead: true }
    });

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    logger.error('Mark notification as read error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark notification as read' });
  }
};

// Mark All Notifications as Read
export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    await prisma.notification.updateMany({
      where: {
        OR: [
          { userId },
          { userId: null }
        ],
        isRead: false
      },
      data: { isRead: true }
    });

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    logger.error('Mark all notifications as read error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark all notifications as read' });
  }
};

// Delete Notification
export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const notificationId = parseInt(id);

    if (isNaN(notificationId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid notification ID'
      });
      return;
    }

    await prisma.notification.delete({
      where: { id: notificationId }
    });

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    logger.error('Delete notification error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete notification' });
  }
};
