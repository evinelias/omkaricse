import express from 'express';
import { createLead, getLeads, exportLeads, updateLeadStatus, addLeadRemark, getLeadRemarks, deleteLeadRemark } from '../controllers/leadController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', createLead);           // Public: For Popup/Contact forms
router.get('/', authenticateToken, getLeads);       // Protected: Admin Dashboard
router.put('/status/:id', authenticateToken, updateLeadStatus); // Protected: Update Status
router.delete('/:id', authenticateToken, require('../controllers/leadController').deleteLead); // Protected: Delete Lead
router.post('/:id/remarks', authenticateToken, addLeadRemark); // Protected: Add Remark
router.get('/:id/remarks', authenticateToken, getLeadRemarks); // Protected: Get Remarks
router.delete('/remarks/:id', authenticateToken, deleteLeadRemark); // Protected: Delete Remark
router.get('/export', authenticateToken, exportLeads); // Protected: Export

export default router;
