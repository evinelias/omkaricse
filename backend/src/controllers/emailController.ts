import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getEmailStats = async (req: Request, res: Response) => {
    try {
        const total = await prisma.emailLog.count();
        const success = await prisma.emailLog.count({ where: { status: 'SUCCESS' } });
        const failed = await prisma.emailLog.count({ where: { status: 'FAILED' } });

        const successRate = total > 0 ? Math.round((success / total) * 100) : 0;

        const logs = await prisma.emailLog.findMany({
            orderBy: { sentAt: 'desc' },
            take: 50
        });

        res.json({
            stats: {
                total,
                success,
                failed,
                successRate
            },
            logs
        });
    } catch (error) {
        console.error("Error fetching email stats:", error);
        res.status(500).json({ message: "Failed to fetch email statistics" });
    }
};

export const sendTestEmail = async (req: Request, res: Response) => {
    try {
        const { sendLeadNotification } = require('../utils/emailService');

        // Create a dummy lead for testing
        const testLead = {
            name: "Test Parent",
            studentName: "Test Student",
            email: "test@example.com",
            phone: "+91 98765 43210",
            grade: "Grade XI",
            inquiryType: "Test Inquiry",
            city: "Test City",
            source: "Admin Test",
            message: "This is a test notification triggered from the Admin Dashboard."
        };

        await sendLeadNotification(testLead);

        res.json({ message: "Test email initiated successfully" });
    } catch (error) {
        console.error("Error sending test email:", error);
        res.status(500).json({ message: "Failed to send test email" });
    }
};
