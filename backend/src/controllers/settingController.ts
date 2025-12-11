import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSettings = async (req: Request, res: Response) => {
    try {
        const config = await prisma.emailConfig.findUnique({
            where: { id: 1 },
        });
        res.json(config);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch settings' });
    }
};

export const updateSettings = async (req: Request, res: Response) => {
    const { receiverEmail, isEnabled } = req.body;
    try {
        // Only update non-sensitive info. Keys are managed via .env now (or seeded).
        const config = await prisma.emailConfig.upsert({
            where: { id: 1 },
            update: { receiverEmail, isEnabled },
            create: { receiverEmail, isEnabled, mailjetApiKey: "", mailjetSecret: "" }, // Defaults if creating new
        });
        res.json(config);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update settings' });
    }
};
