import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logActivity } from '../utils/activityLogger';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log(`[Login Attempt] Email: ${email}`);

    try {
        const admin = await prisma.admin.findUnique({ where: { email } });

        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // CHECK IF FROZEN
        if (admin.isFrozen) {
            return res.status(403).json({ error: 'Account frozen contact super admin' });
        }

        const isValid = await bcrypt.compare(password, admin.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        const token = jwt.sign(
            {
                id: admin.id,
                email: admin.email,
                role: admin.role,
                name: admin.name,
                permissions: admin.permissions || []
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // LOG ACTIVITY
        await logActivity(admin.id, 'LOGIN', 'Admin logged in');

        res.json({ token, user: { ...admin, password: undefined } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
};
