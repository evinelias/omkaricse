import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';
import { sendLeadNotification } from '../utils/emailService';

const prisma = new PrismaClient();

// Create a new lead (Public)
export const createLead = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, source, message, grade, city, studentName, inquiryType } = req.body;

        const lead = await prisma.lead.create({
            data: {
                name,
                email,
                phone,
                source: source || 'unknown',
                message,
                grade,
                city,
                studentName,
                inquiryType,
                status: 'NEW'
            },
        });

        // Trigger email notification (non-blocking)
        sendLeadNotification(lead).catch(err => console.error("Email processing error:", err));

        res.status(201).json(lead);
    } catch (error) {
        console.error('Error creating lead:', error);
        res.status(500).json({ message: 'Failed to create lead' });
    }
};

// Update Lead Status (Protected)
export const updateLeadStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const lead = await prisma.lead.update({
            where: { id: Number(id) },
            data: { status }
        });
        res.json(lead);
    } catch (error) {
        console.error('Error updating lead status:', error);
        res.status(500).json({ message: 'Failed to update lead status' });
    }
};

// Get all leads (Protected)
export const getLeads = async (req: Request, res: Response) => {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(leads);
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ message: 'Failed to fetch leads' });
    }
};

// Export leads to Excel (Protected)
export const exportLeads = async (req: Request, res: Response) => {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Leads');

        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Name', key: 'name', width: 25 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Phone', key: 'phone', width: 15 },
            { header: 'Referral Source', key: 'source', width: 20 },
            { header: 'Message', key: 'message', width: 40 },
            { header: 'Grade', key: 'grade', width: 15 },
            { header: 'City', key: 'city', width: 15 },
            { header: 'Created At', key: 'createdAt', width: 20 },
        ];

        leads.forEach((lead) => {
            worksheet.addRow({
                ...lead,
                source: lead.source ? lead.source.replace(/_/g, ' ') : '',
                createdAt: lead.createdAt.toISOString(),
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=leads.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exporting leads:', error);
        res.status(500).json({ message: 'Failed to export leads' });
    }
};

// Delete a lead (Protected)
export const deleteLead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.lead.delete({
            where: { id: Number(id) }
        });
        res.status(200).json({ message: 'Lead deleted successfully' });
    } catch (error) {
        console.error('Error deleting lead:', error);
        res.status(500).json({ message: 'Failed to delete lead' });
    }
};
