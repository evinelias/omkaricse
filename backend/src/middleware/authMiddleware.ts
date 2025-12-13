import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = (authHeader && authHeader.split(' ')[1]) || (req.query.token as string);

    if (!token) {
        console.warn('Auth Middleware: No token provided in Header or Query');
        return res.sendStatus(401);
    }

    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not defined");
        return res.status(500).json({ error: 'Server Misconfiguration: JWT_SECRET is missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
        if (err) {
            console.error('Auth Middleware: Invalid Token', err.message);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};
