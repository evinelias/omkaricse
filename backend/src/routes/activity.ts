
import express from 'express';
import { getActivityLogs } from '../controllers/activityController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Middleware to check if Super Admin
const requireSuperAdmin = (req: any, res: any, next: any) => {
    if (req.user?.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Access denied: Super Admin only' });
    }
    next();
};

router.use(authenticateToken);
router.use(requireSuperAdmin); // Logs are sensitive

router.get('/', getActivityLogs);

export default router;
