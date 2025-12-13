import express from 'express';
import { getSettings, updateSettings, sendTestEmail } from '../controllers/settingController';
import { getEmailStats } from '../controllers/emailController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, getSettings);
router.put('/', authenticateToken, updateSettings);
router.get('/email-stats', authenticateToken, getEmailStats);
router.post('/test-email', authenticateToken, sendTestEmail);

export default router;
