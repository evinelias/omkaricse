import express from 'express';
import { createLead, getLeads, exportLeads, updateLeadStatus } from '../controllers/leadController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', createLead);           // Public: For Popup/Contact forms
router.get('/', authenticateToken, getLeads);       // Protected: Admin Dashboard
router.put('/status/:id', authenticateToken, updateLeadStatus); // Protected: Update Status
router.delete('/:id', authenticateToken, require('../controllers/leadController').deleteLead); // Protected: Delete Lead
router.get('/export', authenticateToken, exportLeads); // Protected: Export

export default router;
