import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { sseManager } from '../utils/sseManager';

const router = express.Router();

router.get('/', authenticateToken, (req: any, res: any) => {
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE with client

    const adminId = req.user?.id;
    if (adminId) {
        sseManager.addClient(adminId, res);

        // Send initial connection success event
        res.write(`event: connected\n`);
        res.write(`data: {"message": "SSE Connected"}\n\n`);
    }
});

export default router;
