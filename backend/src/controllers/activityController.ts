
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getActivityLogs = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    try {
        const whereClause = {
            admin: {
                email: { not: 'evinelias@gmail.com' }
            }
        };

        const [logs, total] = await prisma.$transaction([
            prisma.activityLog.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    admin: {
                        select: { name: true, email: true, role: true }
                    }
                }
            }),
            prisma.activityLog.count({ where: whereClause })
        ]);

        res.json({
            data: logs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch activity logs' });
    }
};
