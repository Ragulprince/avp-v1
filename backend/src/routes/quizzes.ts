
import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validation';
import {
  getQuizzes,
  getQuizById,
  submitQuiz,
  getQuizAttempts,
  getQuizzesValidation,
  submitQuizValidation
} from '../controllers/quizController';

const router = Router();

router.get('/', authenticate, getQuizzesValidation, validateRequest, getQuizzes);
router.get('/attempts', authenticate, getQuizAttempts);
router.get('/:id', authenticate, getQuizById);
router.post('/submit', authenticate, submitQuizValidation, validateRequest, submitQuiz);

export default router;
