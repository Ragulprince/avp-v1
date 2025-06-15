
import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validation';
import { body } from 'express-validator';
import {
  createTest,
  getTests,
  addQuestionToTest,
  getTestReport,
  getStudentTestReport,
  toggleTestPublish
} from '../controllers/testController';

const router = Router();

// Test Management
router.post('/',
  authenticate,
  authorize('ADMIN', 'TEACHER'),
  [
    body('title').notEmpty().withMessage('Test title is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('type').isIn(['PRACTICE', 'MOCK', 'DAILY', 'SUBJECT_WISE', 'CUSTOM']).withMessage('Valid test type is required'),
    body('duration').isNumeric().withMessage('Valid duration is required'),
    body('totalMarks').isNumeric().withMessage('Valid total marks is required'),
    body('passingMarks').isNumeric().withMessage('Valid passing marks is required'),
    body('courseId').isUUID().withMessage('Valid course ID is required')
  ],
  validateRequest,
  createTest
);

router.get('/', authenticate, authorize('ADMIN', 'TEACHER'), getTests);

// Add question to test
router.post('/:testId/questions',
  authenticate,
  authorize('ADMIN', 'TEACHER'),
  addQuestionToTest
);

// Test reports
router.get('/:testId/report', authenticate, authorize('ADMIN', 'TEACHER'), getTestReport);
router.get('/:testId/students/:studentId/report', authenticate, authorize('ADMIN', 'TEACHER'), getStudentTestReport);

// Publish/Unpublish test
router.patch('/:testId/publish',
  authenticate,
  authorize('ADMIN', 'TEACHER'),
  [
    body('isPublished').isBoolean().withMessage('isPublished must be boolean')
  ],
  validateRequest,
  toggleTestPublish
);

export default router;
