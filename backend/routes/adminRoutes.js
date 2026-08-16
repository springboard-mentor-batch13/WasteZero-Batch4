import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { downloadPerformanceReport, getAdminActivity, getAdminOverview, getAdminUsers, updateAdminUser } from '../controller/adminController.js';

const router = express.Router();
router.use(protect, admin);
router.get('/overview', getAdminOverview);
router.get('/users', getAdminUsers);
router.patch('/users/:id', updateAdminUser);
router.get('/activity', getAdminActivity);
router.get('/reports/performance.csv', downloadPerformanceReport);
export default router;
