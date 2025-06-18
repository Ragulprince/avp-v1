import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
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

// All admin routes require authentication and ADMIN role
router.use(authenticate, authorize('ADMIN'));

// Student Management
router.post('/students', createStudent);
router.get('/students', getStudents);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

// Course Management
router.post('/courses', createCourse);
router.get('/courses', getCourses);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

// Batch Management
router.post('/batches', createBatch);
router.get('/batches', getBatches);

// Staff Management
router.post('/staff', createStaff);
router.get('/staff', getStaff);

// Settings
router.get('/settings', (_, res) => getAdminSettings(res));

export default router;
