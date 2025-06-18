import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
  getContentStream,
  uploadStudyMaterial
} from '../controllers/contentController';
import { authenticate, authorize } from '../middlewares/auth';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Create a new study material (with file upload)
router.post('/', authenticate, authorize('ADMIN', 'TEACHER'), upload.single('file'), uploadStudyMaterial);

// Get all study materials
router.get('/', authenticate, getMaterials);

// Test endpoint to list all materials (for debugging)
router.get('/debug/list', authenticate, async (_, res) => {
  try {
    const materials = await prisma.studyMaterial.findMany({
      select: {
        material_id: true,
        title: true,
        file_url: true,
        file_type: true,
        is_published: true
      }
    });
    res.json({ success: true, data: materials });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching materials' });
  }
});

// Secure content viewing route (must come before /:id route)
router.get('/view/:id', authenticate, authorize('STUDENT', 'ADMIN', 'TEACHER'), getContentStream);

// Get a specific study material
router.get('/:id', authenticate, getMaterialById);

// Update a study material
router.put('/:id', authenticate, authorize('ADMIN', 'TEACHER'), updateMaterial);

// Delete a study material
router.delete('/:id', authenticate, authorize('ADMIN', 'TEACHER'), deleteMaterial);

export default router;
