import { Router } from 'express';
import {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
  getCoursesForSubject
} from '../controllers/subjectController';

const router = Router();

router.get('/', getSubjects);
router.get('/:id', getSubject);
router.post('/', createSubject);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);
router.get('/:id/courses', getCoursesForSubject);

export default router; 