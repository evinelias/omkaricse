import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log(`[Login Attempt] Email: ${email}, Password Length: ${password ? password.length : 0}`);

    try {
        const admin = await prisma.admin.findUnique({ where: { email } });

        if (!admin) {
            console.log('[Login Failed] Admin user not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            console.log('[Login Failed] Password mismatch');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
