
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const HIDDEN_ADMINS = ['evinelias@gmail.com'];

export const logActivity = async (adminId: number, action: string, details: string) => {
    try {
        if (!adminId) return;

        // Note: Hiding of specific admins is now handled in the fetch query (activityController)
        // to ensure reliable logging for everyone else.

        await prisma.activityLog.create({
            data: {
                adminId,
                action,
                details: typeof details === 'object' ? JSON.stringify(details) : String(details)
            }
        });
    } catch (e) {
        console.error("Failed to log activity:", e);
    }
};
