import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '../utils/emailService';
import { sseManager } from '../utils/sseManager';

const prisma = new PrismaClient();

export const getSettings = async (req: Request, res: Response) => {
    try {
        let config = await prisma.emailConfig.findFirst({
            where: { id: 1 },
        });

        if (!config) {
            config = await prisma.emailConfig.create({
                data: {
                    receiverEmails: ["admin@omkaricse.in"],
                    isEnabled: true
                }
            });
        }
        res.json(config);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch settings' });
    }
};

export const updateSettings = async (req: Request, res: Response) => {
    const { receiverEmails, isEnabled } = req.body;
    try {
        const config = await prisma.emailConfig.upsert({
            where: { id: 1 },
            update: { receiverEmails, isEnabled },
            create: { receiverEmails: receiverEmails || ["admin@omkaricse.in"], isEnabled: isEnabled ?? true },
        });

        sseManager.broadcast('settings_update', config);

        res.json(config);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update settings' });
    }
};

export const sendTestEmail = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        await sendEmail(email, "OIS Test Email", "This is a test email from the OIS Admin Dashboard.");
        res.json({ message: "Test email sent" });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message || "Failed to send test email" });
    }
};
