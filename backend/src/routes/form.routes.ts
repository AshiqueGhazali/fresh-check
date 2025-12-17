import { Router } from 'express';
import { getAllForms, getForm, createForm, updateForm, deleteForm } from '../controllers/form.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// All authenticated users can view forms
router.get('/', getAllForms);
router.get('/:id', getForm);

// Only admins can create, update, delete
router.post('/', authorize(['ADMIN']), createForm);
router.put('/:id', authorize(['ADMIN']), updateForm);
router.delete('/:id', authorize(['ADMIN']), deleteForm);

export default router;
