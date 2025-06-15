
import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validation';
import { body } from 'express-validator';
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionById,
  bulkImportQuestions
} from '../controllers/questionBankController';

const router = Router();

// Question Bank Management
router.get('/', authenticate, authorize('ADMIN', 'TEACHER'), getQuestions);

router.post('/',
  authenticate,
  authorize('ADMIN', 'TEACHER'),
  [
    body('question').notEmpty().withMessage('Question text is required'),
    body('type').isIn(['MCQ', 'FILL_BLANKS', 'TRUE_FALSE', 'MATCH', 'CHOICE_BASED']).withMessage('Valid question type is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('topic').notEmpty().withMessage('Topic is required'),
    body('difficulty').isIn(['EASY', 'MEDIUM', 'HARD']).withMessage('Valid difficulty is required'),
    body('correctAnswer').notEmpty().withMessage('Correct answer is required')
  ],
  validateRequest,
  createQuestion
);

router.get('/:id', authenticate, authorize('ADMIN', 'TEACHER'), getQuestionById);
router.put('/:id', authenticate, authorize('ADMIN', 'TEACHER'), updateQuestion);
router.delete('/:id', authenticate, authorize('ADMIN', 'TEACHER'), deleteQuestion);

// Bulk import
router.post('/bulk-import',
  authenticate,
  authorize('ADMIN', 'TEACHER'),
  [
    body('questions').isArray().withMessage('Questions array is required')
  ],
  validateRequest,
  bulkImportQuestions
);

export default router;
