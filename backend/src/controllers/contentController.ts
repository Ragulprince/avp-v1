import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';
import { logger } from '../config/logger';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (_req: any, file: any, cb: any) => {
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
export const uploadStudyMaterial = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, courseId, type } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({
        success: false,
        message: 'File is required'
      });
      return;
    }

    // Determine material type based on mime type if not provided
    let materialType: 'PDF' | 'PPT' | 'DOC' | 'IMAGE' | 'OTHER' = type || 'OTHER';
    if (!type) {
      if (file.mimetype === 'application/pdf') materialType = 'PDF';
      else if (file.mimetype.includes('powerpoint') || file.mimetype.includes('presentation')) materialType = 'PPT';
      else if (file.mimetype.includes('word') || file.mimetype.includes('document')) materialType = 'DOC';
      else if (file.mimetype.includes('image')) materialType = 'IMAGE';
    }

    const material = await prisma.studyMaterial.create({
      data: {
        title,
        description,
        file_type: materialType,
        file_url: `/uploads/${file.filename}`,
        file_name: file.originalname,
        file_size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        course_id: courseId ? parseInt(courseId) : null,
        is_published: false
      },
      include: {
        course: true,
        subject: true
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
export const uploadVideo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, subject, courseId } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({
        success: false,
        message: 'Video file is required'
      });
      return;
    }

    const video = await prisma.video.create({
      data: {
        title,
        description,
        subject,
        video_url: `/uploads/${file.filename}`,
        course_id: courseId,
        is_published: false
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
        orderBy: { created_at: 'desc' }
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
export const serveFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { filename } = req.params;
    const userId = req.user?.user_id;

    // Check if user has access to this file
    const student = await prisma.user.findUnique({
      where: { user_id: userId },
      include: {
        student_profile: true
      }
    });

    if (!student?.student_profile?.course_id) {
      res.status(403).json({
        success: false,
        message: 'Access denied'
      });
      return;
    }

    const filePath = path.join(__dirname, '../../uploads', filename);
    
    if (!fs.existsSync(filePath)) {
      res.status(404).json({
        success: false,
        message: 'File not found'
      });
      return;
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
export const toggleMaterialPublish = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;
    const materialId = parseInt(id);

    if (isNaN(materialId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid material ID'
      });
      return;
    }

    const material = await prisma.studyMaterial.update({
      where: { material_id: materialId },
      data: { is_published: isPublished }
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

export const getContentStream = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.user_id;

    console.log('getContentStream called with id:', id, 'userId:', userId);

    // Get the material and verify access
    const material = await prisma.studyMaterial.findUnique({
      where: { material_id: parseInt(id) },
      include: {
        course: {
          include: {
            students: {
              where: { user_id: userId }
            }
          }
        }
      }
    });

    console.log('Material found:', material);

    if (!material) {
      console.log('Material not found for id:', id);
      return res.status(404).json({ message: 'Material not found' });
    }

    // Check if user has access to the material
    const hasAccess = material.course?.students.some(student => student.user_id === userId) || 
                     req.user?.role === 'ADMIN' || 
                     req.user?.role === 'TEACHER';

    console.log('User access check:', {
      hasAccess,
      userRole: req.user?.role,
      courseStudents: material.course?.students.length
    });

    if (!hasAccess) {
      console.log('Access denied for user:', userId);
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!material.file_url) {
      console.log('File URL not found for material:', material.material_id);
      return res.status(404).json({ message: 'File URL not found' });
    }

    const filePath = path.join(process.env.UPLOAD_DIR || 'uploads', material.file_url);

    console.log('File path:', filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log('File not found at path:', filePath);
      return res.status(404).json({ message: 'File not found' });
    }

    // Set appropriate headers based on file type
    const contentType = getContentType(material.file_type || 'OTHER');
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${material.file_name || 'file'}"`);

    console.log('Streaming file with content type:', contentType);

    // Stream the file
    const fileStream = createReadStream(filePath);
    await pipeline(fileStream, res);
    
    return res.end();
  } catch (error) {
    console.error('Error streaming content:', error);
    return res.status(500).json({ message: 'Error streaming content' });
  }
};

const getContentType = (fileType: string): string => {
  switch (fileType) {
    case 'PDF':
      return 'application/pdf';
    case 'IMAGE':
      return 'image/jpeg';
    case 'VIDEO':
      return 'video/mp4';
    case 'DOC':
      return 'application/msword';
    case 'PPT':
      return 'application/vnd.ms-powerpoint';
    default:
      return 'application/octet-stream';
  }
};

// Create a new study material
export const createMaterial = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, file_url, file_type, file_name, file_size, subject_id, course_id } = req.body;

    const material = await prisma.studyMaterial.create({
      data: {
        title,
        description,
        file_url,
        file_type,
        file_name,
        file_size,
        subject_id: subject_id ? parseInt(subject_id) : null,
        course_id: course_id ? parseInt(course_id) : null,
      }
    });

    return res.status(201).json(material);
  } catch (error) {
    console.error('Error creating material:', error);
    return res.status(500).json({ message: 'Error creating material' });
  }
};

// Get all study materials
export const getMaterials = async (_req: AuthRequest, res: Response) => {
  try {
    const materials = await prisma.studyMaterial.findMany({
      include: {
        subject: true,
        course: true
      },
      orderBy: { created_at: 'desc' }
    });

    // Transform the data to match frontend expectations
    const transformedMaterials = materials.map(material => ({
      id: material.material_id.toString(),
      title: material.title,
      description: material.description,
      subject: material.subject?.name || 'Unknown',
      topic: material.subject?.name || 'Unknown',
      type: material.file_type || 'OTHER',
      fileUrl: material.file_url,
      fileName: material.file_name,
      fileSize: material.file_size,
      isPublished: material.is_published,
      courseId: material.course_id?.toString(),
      course: material.course,
      createdAt: material.created_at.toISOString()
    }));

    return res.json({
      success: true,
      data: transformedMaterials
    });
  } catch (error) {
    console.error('Error fetching materials:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error fetching materials' 
    });
  }
};

// Get a specific study material
export const getMaterialById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const material = await prisma.studyMaterial.findUnique({
      where: {
        material_id: parseInt(id)
      },
      include: {
        subject: true,
        course: true
      }
    });

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    return res.json({
      success: true,
      data: material
    });
  } catch (error) {
    logger.error('Get material by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get material'
    });
  }
};

// Update a study material
export const updateMaterial = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, file_url, file_type, file_name, file_size, subject_id, course_id, is_published } = req.body;

    const material = await prisma.studyMaterial.update({
      where: { material_id: parseInt(id) },
      data: {
        title,
        description,
        file_url,
        file_type,
        file_name,
        file_size,
        subject_id: subject_id ? parseInt(subject_id) : null,
        course_id: course_id ? parseInt(course_id) : null,
        is_published
      }
    });

    return res.json(material);
  } catch (error) {
    console.error('Error updating material:', error);
    return res.status(500).json({ message: 'Error updating material' });
  }
};

// Delete a study material
export const deleteMaterial = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const material = await prisma.studyMaterial.findUnique({
      where: { material_id: parseInt(id) }
    });

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Delete the file if it exists
    if (material.file_url) {
      const filePath = path.join(process.env.UPLOAD_DIR || 'uploads', material.file_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await prisma.studyMaterial.delete({
      where: { material_id: parseInt(id) }
    });

    return res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Error deleting material:', error);
    return res.status(500).json({ message: 'Error deleting material' });
  }
};
