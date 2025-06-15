
import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validation';
import { body } from 'express-validator';
import {
  createNotification,
  broadcastNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from '../controllers/notificationController';

const router = Router();

// Admin routes
router.post('/',
  authenticate,
  authorize('ADMIN'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('message').notEmpty().withMessage('Message is required'),
    body('type').isIn(['GENERAL', 'QUIZ', 'VIDEO', 'ANNOUNCEMENT', 'REMINDER']).withMessage('Valid type is required')
  ],
  validateRequest,
  createNotification
);

router.post('/broadcast',
  authenticate,
  authorize('ADMIN'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('message').notEmpty().withMessage('Message is required'),
    body('type').isIn(['GENERAL', 'QUIZ', 'VIDEO', 'ANNOUNCEMENT', 'REMINDER']).withMessage('Valid type is required')
  ],
  validateRequest,
  broadcastNotification
);

router.delete('/:id', authenticate, authorize('ADMIN'), deleteNotification);

// Student routes
router.get('/', authenticate, getUserNotifications);
router.patch('/:id/read', authenticate, markAsRead);
router.patch('/read-all', authenticate, markAllAsRead);

export default router;
