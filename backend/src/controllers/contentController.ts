
import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';
import { logger } from '../config/logger';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  // Allow documents, images, and videos
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/avi',
    'video/mkv'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

export const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit
  }
});

// Upload Study Material
export const uploadStudyMaterial = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, subject, topic, courseId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'File is required'
      });
    }

    // Determine material type based on mime type
    let type = 'OTHER';
    if (file.mimetype === 'application/pdf') type = 'PDF';
    else if (file.mimetype.includes('powerpoint') || file.mimetype.includes('presentation')) type = 'PPT';
    else if (file.mimetype.includes('word') || file.mimetype.includes('document')) type = 'DOC';
    else if (file.mimetype.includes('image')) type = 'IMAGE';

    const material = await prisma.studyMaterial.create({
      data: {
        title,
        description,
        subject,
        topic,
        type,
        fileUrl: `/uploads/${file.filename}`,
        fileName: file.originalname,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        courseId,
        isPublished: false
      }
    });

    res.status(201).json({
      success: true,
      message: 'Study material uploaded successfully',
      data: material
    });
  } catch (error) {
    logger.error('Upload study material error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload study material' });
  }
};

// Upload Video
export const uploadVideo = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, subject, topic, courseId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Video file is required'
      });
    }

    const video = await prisma.video.create({
      data: {
        title,
        description,
        subject,
        topic,
        videoUrl: `/uploads/${file.filename}`,
        courseId,
        isPublished: false
      }
    });

    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully',
      data: video
    });
  } catch (error) {
    logger.error('Upload video error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload video' });
  }
};

// Get Study Materials
export const getStudyMaterials = async (req: AuthRequest, res: Response) => {
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

    const [materials, total] = await Promise.all([
      prisma.studyMaterial.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        include: {
          course: true
        },
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
    logger.error('Get study materials error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch study materials' });
  }
};

// Serve protected file
export const serveFile = async (req: AuthRequest, res: Response) => {
  try {
    const { filename } = req.params;
    const userId = req.user?.id;

    // Check if user has access to this file
    const student = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true
      }
    });

    if (!student?.studentProfile?.courseId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const filePath = path.join(__dirname, '../../uploads', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Set appropriate headers for file serving
    res.setHeader('Content-Disposition', 'inline');
    res.sendFile(filePath);
  } catch (error) {
    logger.error('Serve file error:', error);
    res.status(500).json({ success: false, message: 'Failed to serve file' });
  }
};

// Toggle material publish status
export const toggleMaterialPublish = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;

    const material = await prisma.studyMaterial.update({
      where: { id },
      data: { isPublished }
    });

    res.json({
      success: true,
      message: `Material ${isPublished ? 'published' : 'unpublished'} successfully`,
      data: material
    });
  } catch (error) {
    logger.error('Toggle material publish error:', error);
    res.status(500).json({ success: false, message: 'Failed to update material status' });
  }
};
