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
  updateStaff,
  deleteStaff,
  getAdminSettings,
  getCourse
} from '../controllers/adminController';
import {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject
} from '../controllers/subjectController';

const router = Router();

// Apply authentication and authorization middleware to all routes
router.use(authenticate);
router.use(authorize('ADMIN'));

// Student Management
router.post('/students', createStudent);
router.get('/students', getStudents);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

// Course Management
router.post('/courses', createCourse);
router.get('/courses', getCourses);
router.get('/courses/:id', getCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

// Batch Management
router.post('/batches', createBatch);
router.get('/batches', getBatches);

// Staff Management
router.post('/staff', createStaff);
router.get('/staff', getStaff);
router.put('/staff/:id', updateStaff);
router.delete('/staff/:id', deleteStaff);

// Settings
router.get('/settings', getAdminSettings);

// Subject Management
router.get('/subjects', getSubjects);
router.get('/subjects/:id', getSubject);
router.post('/subjects', createSubject);
router.put('/subjects/:id', updateSubject);
router.delete('/subjects/:id', deleteSubject);

export default router;
