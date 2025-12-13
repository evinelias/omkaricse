
import express from 'express';
import { getUsers, createUser, updateUser, deleteUser, resetPassword } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Middleware to check if Super Admin (inlined for simplicity or move to middleware)
const requireSuperAdmin = (req: any, res: any, next: any) => {
    if (req.user?.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Access denied: Super Admin only' });
    }
    next();
};

router.use(authenticateToken);
// router.use(requireSuperAdmin); // Removed to allow granular permissions

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.put('/:id/reset-password', resetPassword);

export default router;
