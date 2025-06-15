
import { Response } from 'express';
import { query } from 'express-validator';
import { prisma } from '../config/database';
import { AuthRequest, ApiResponse, SearchQuery } from '../types';
import { logger } from '../config/logger';

export const getVideosValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('subject').optional().isString(),
  query('search').optional().isString()
];

export const getVideos = async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '10', subject, search }: SearchQuery = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where: any = {
      isPublished: true
    };

    if (subject && subject !== 'all') {
      where.subject = subject;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { topic: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Filter by user's course if student
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      include: { studentProfile: true }
    });

    if (user?.role === 'STUDENT' && user.studentProfile?.courseId) {
      where.courseId = user.studentProfile.courseId;
    }

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        include: {
          course: {
            select: {
              id: true,
              name: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.video.count({ where })
    ]);

    const response: ApiResponse = {
      success: true,
      message: 'Videos retrieved successfully',
      data: videos,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    };

    res.json(response);
  } catch (error) {
    logger.error('Get videos error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getVideoById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const videoId = parseInt(id);

    if (isNaN(videoId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid video ID'
      });
      return;
    }

    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        course: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!video || !video.isPublished) {
      res.status(404).json({
        success: false,
        message: 'Video not found'
      });
      return;
    }

    // Update view count
    await prisma.video.update({
      where: { id: videoId },
      data: { views: { increment: 1 } }
    });

    const response: ApiResponse = {
      success: true,
      message: 'Video retrieved successfully',
      data: video
    };

    res.json(response);
  } catch (error) {
    logger.error('Get video error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const downloadVideo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const videoId = parseInt(id);
    const userId = req.user!.id;

    if (isNaN(videoId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid video ID'
      });
      return;
    }

    const video = await prisma.video.findUnique({
      where: { id: videoId }
    });

    if (!video || !video.isPublished) {
      res.status(404).json({
        success: false,
        message: 'Video not found'
      });
      return;
    }

    // Check if user already has active download
    const existingDownload = await prisma.videoDownload.findUnique({
      where: {
        userId_videoId: {
          userId,
          videoId: videoId
        }
      }
    });

    if (existingDownload && existingDownload.expiresAt > new Date()) {
      res.json({
        success: true,
        message: 'Download link already active',
        data: {
          downloadUrl: video.videoUrl,
          expiresAt: existingDownload.expiresAt
        }
      });
      return;
    }

    // Create new download record with 24-hour expiry
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const download = await prisma.videoDownload.upsert({
      where: {
        userId_videoId: {
          userId,
          videoId: videoId
        }
      },
      update: {
        expiresAt
      },
      create: {
        userId,
        videoId: videoId,
        expiresAt
      }
    });

    const response: ApiResponse = {
      success: true,
      message: 'Video download authorized',
      data: {
        downloadUrl: video.videoUrl,
        expiresAt: download.expiresAt
      }
    };

    res.json(response);
  } catch (error) {
    logger.error('Download video error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getVideoSubjects = async (req: AuthRequest, res: Response) => {
  try {
    const subjects = await prisma.video.findMany({
      where: { isPublished: true },
      select: { subject: true },
      distinct: ['subject']
    });

    const response: ApiResponse = {
      success: true,
      message: 'Video subjects retrieved successfully',
      data: subjects.map(s => s.subject)
    };

    res.json(response);
  } catch (error) {
    logger.error('Get video subjects error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
