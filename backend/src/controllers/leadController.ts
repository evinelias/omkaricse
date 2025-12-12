import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';
import { sendLeadNotification } from '../utils/emailService';
import axios from 'axios'; // Added axios import

const prisma = new PrismaClient();

// Create a new lead (Public)
// Google reCAPTCHA Secret Key
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

export const createLead = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, source, message, grade, city, studentName, inquiryType, token } = req.body; // Added token

        // Verify reCAPTCHA Token if provided
        if (token === 'NO_RECAPTCHA_DEV') {
            if (process.env.NODE_ENV === 'production') {
                return res.status(400).json({ error: 'Cannot bypass reCAPTCHA in production' });
            }
            console.log('Skipping reCAPTCHA verification in DEV mode');
        } else if (token && RECAPTCHA_SECRET_KEY) {
            try {
                const recaptchaResponse = await axios.post(
                    `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
                );

                const { success, score } = recaptchaResponse.data;

                if (!success || (score !== undefined && score < 0.5)) {
                    console.warn(`reCAPTCHA failed for ${email}: score ${score}`);
                    return res.status(400).json({ error: 'reCAPTCHA verification failed. Please try again.' });
                }
            } catch (captchaError) {
                console.error('reCAPTCHA Verification Error:', captchaError);
                // Continue cautiously or fail? For now, we log and continue to avoid blocking legitimate users on API errors.
                // return res.status(500).json({ error: 'Captcha service unavailable' });
            }
        } else if (RECAPTCHA_SECRET_KEY && !token && source !== 'admin_test') { // Allow admin tests to bypass
            // Optional: Enforce token presence in production
            // return res.status(400).json({ error: 'reCAPTCHA token missing' });
        }

        const newLead = await prisma.lead.create({ // Changed 'lead' to 'newLead'
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

        // Send email notification (async)
        // const newLead = await prisma.lead.create(...) was correct
        // but usages below were using 'lead'
        sendLeadNotification(newLead).catch(console.error);

        res.status(201).json(newLead);
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
        res.status(500).json({ message: 'Failed to fetch leads', error: error instanceof Error ? error.message : String(error) });
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
