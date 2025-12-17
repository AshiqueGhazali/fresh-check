import { Router } from 'express';
import { getAllGuidelines, getGuideline, createGuideline, updateGuideline, deleteGuideline } from '../controllers/guideline.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// All users can view guidelines
router.get('/', getAllGuidelines);
router.get('/:id', getGuideline);

// Only admins can create, update, delete
router.post('/', authorize(['ADMIN']), createGuideline);
router.put('/:id', authorize(['ADMIN']), updateGuideline);
router.delete('/:id', authorize(['ADMIN']), deleteGuideline);

export default router;
