
import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validation';
import { body } from 'express-validator';
import {
  upload,
  uploadStudyMaterial,
  uploadVideo,
  getStudyMaterials,
  serveFile,
  toggleMaterialPublish
} from '../controllers/contentController';

const router = Router();

// File uploads (Admin only)
router.post('/materials/upload',
  authenticate,
  authorize('ADMIN', 'TEACHER'),
  upload.single('file'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('topic').notEmpty().withMessage('Topic is required'),
    body('courseId').isUUID().withMessage('Valid course ID is required')
  ],
  validateRequest,
  uploadStudyMaterial
);

router.post('/videos/upload',
  authenticate,
  authorize('ADMIN', 'TEACHER'),
  upload.single('video'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('topic').notEmpty().withMessage('Topic is required'),
    body('courseId').isUUID().withMessage('Valid course ID is required')
  ],
  validateRequest,
  uploadVideo
);

// Content management
router.get('/materials', authenticate, getStudyMaterials);
router.patch('/materials/:id/publish',
  authenticate,
  authorize('ADMIN', 'TEACHER'),
  [
    body('isPublished').isBoolean().withMessage('isPublished must be boolean')
  ],
  validateRequest,
  toggleMaterialPublish
);

// Serve protected files
router.get('/files/:filename', authenticate, serveFile);

export default router;
