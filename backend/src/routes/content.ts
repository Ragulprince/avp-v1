import express from 'express';
import {
  createMaterial,
  getMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
  getContentStream
} from '../controllers/contentController';
import { authenticate, authorize } from '../middlewares/auth';

const router = express.Router();

// Create a new study material
router.post('/', authenticate, authorize('ADMIN', 'TEACHER'), createMaterial);

// Get all study materials
router.get('/', authenticate, getMaterials);

// Get a specific study material
router.get('/:id', authenticate, getMaterialById);

// Update a study material
router.put('/:id', authenticate, authorize('ADMIN', 'TEACHER'), updateMaterial);

// Delete a study material
router.delete('/:id', authenticate, authorize('ADMIN', 'TEACHER'), deleteMaterial);

// Secure content viewing route
router.get('/view/:id', authenticate, authorize('STUDENT', 'ADMIN', 'TEACHER'), getContentStream);

export default router;
