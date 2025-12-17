import { Router } from 'express';
import { getAllReports, getReport, createReport, updateReport, submitReport, approveReport, rejectReport } from '../controllers/report.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// All authenticated users can view reports (filtered by role in controller)
router.get('/', getAllReports);
router.get('/:id', getReport);

// Inspectors can create, update and submit reports
router.post('/', authorize(['INSPECTOR']), createReport);
router.put('/:id', authorize(['INSPECTOR']), updateReport);
router.put('/:id/submit', authorize(['INSPECTOR']), submitReport);

// Admins can approve/reject reports
router.put('/:id/approve', authorize(['ADMIN']), approveReport);
router.put('/:id/reject', authorize(['ADMIN']), rejectReport);

export default router;

