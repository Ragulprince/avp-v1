
import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validation';
import { body } from 'express-validator';
import {
  getStudentDashboard,
  getStudentProfile,
  updateStudentProfile,
  changePassword,
  getStudentVideos,
  getStudentMaterials
} from '../controllers/studentController';

const router = Router();

// Student Dashboard
router.get('/dashboard', authenticate, getStudentDashboard);

// Profile Management
router.get('/profile', authenticate, getStudentProfile);
router.put('/profile',
  authenticate,
  [
    body('name').optional().notEmpty(),
    body('phone').optional().isMobilePhone('any')
  ],
  validateRequest,
  updateStudentProfile
);

// Password Change
router.post('/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
  ],
  validateRequest,
  changePassword
);

// Content Access
router.get('/videos', authenticate, getStudentVideos);
router.get('/materials', authenticate, getStudentMaterials);

export default router;
