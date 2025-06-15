
import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validation';
import { body, query } from 'express-validator';
import {
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,
  createBatch,
  getBatches,
  createStaff,
  getStaff,
  getAdminSettings
} from '../controllers/adminController';

const router = Router();

// Student Management
router.post('/students', 
  authenticate, 
  authorize('ADMIN'),
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('phone').optional().isMobilePhone('any'),
    body('batchId').optional().isUUID(),
    body('courseId').optional().isUUID()
  ],
  validateRequest,
  createStudent
);

router.get('/students', authenticate, authorize('ADMIN'), getStudents);

router.put('/students/:id',
  authenticate,
  authorize('ADMIN'),
  [
    body('name').optional().notEmpty(),
    body('phone').optional().isMobilePhone('any'),
    body('isActive').optional().isBoolean()
  ],
  validateRequest,
  updateStudent
);

router.delete('/students/:id', authenticate, authorize('ADMIN'), deleteStudent);

// Course Management
router.post('/courses',
  authenticate,
  authorize('ADMIN'),
  [
    body('name').notEmpty().withMessage('Course name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('duration').notEmpty().withMessage('Duration is required'),
    body('fees').isNumeric().withMessage('Valid fees amount is required'),
    body('subjects').isArray().withMessage('Subjects array is required')
  ],
  validateRequest,
  createCourse
);

router.get('/courses', authenticate, authorize('ADMIN'), getCourses);
router.put('/courses/:id', authenticate, authorize('ADMIN'), updateCourse);
router.delete('/courses/:id', authenticate, authorize('ADMIN'), deleteCourse);

// Batch Management
router.post('/batches',
  authenticate,
  authorize('ADMIN'),
  [
    body('name').notEmpty().withMessage('Batch name is required'),
    body('timing').notEmpty().withMessage('Timing is required'),
    body('capacity').isNumeric().withMessage('Valid capacity is required'),
    body('courseId').isUUID().withMessage('Valid course ID is required')
  ],
  validateRequest,
  createBatch
);

router.get('/batches', authenticate, authorize('ADMIN'), getBatches);

// Staff Management
router.post('/staff',
  authenticate,
  authorize('ADMIN'),
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('role').isIn(['ADMIN', 'TEACHER']).withMessage('Valid role is required')
  ],
  validateRequest,
  createStaff
);

router.get('/staff', authenticate, authorize('ADMIN'), getStaff);

// Settings
router.get('/settings', authenticate, authorize('ADMIN'), getAdminSettings);

export default router;
