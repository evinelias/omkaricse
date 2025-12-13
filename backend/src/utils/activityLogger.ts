
import { PrismaClient } from '@prisma/client';
import { sseManager } from './sseManager';

const prisma = new PrismaClient();

const HIDDEN_ADMINS = ['evinelias@gmail.com'];

export const logActivity = async (adminId: number, action: string, details: string) => {
    try {
        if (!adminId) return;

        // Note: Hiding of specific admins is now handled in the fetch query (activityController)
        // to ensure reliable logging for everyone else.

        const log = await prisma.activityLog.create({
            data: {
                adminId,
                action,
                details: typeof details === 'object' ? JSON.stringify(details) : String(details)
            },
            include: { admin: { select: { name: true, email: true } } }
        });

        sseManager.broadcast('new_activity', log);
    } catch (e) {
        console.error("Failed to log activity:", e);
    }
};
