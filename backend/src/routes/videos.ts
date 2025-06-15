
import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validation';
import {
  getVideos,
  getVideoById,
  downloadVideo,
  getVideoSubjects,
  getVideosValidation
} from '../controllers/videoController';

const router = Router();

router.get('/', authenticate, getVideosValidation, validateRequest, getVideos);
router.get('/subjects', authenticate, getVideoSubjects);
router.get('/:id', authenticate, getVideoById);
router.post('/:id/download', authenticate, downloadVideo);

export default router;
