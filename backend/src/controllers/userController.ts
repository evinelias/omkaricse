
import { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { sseManager } from '../utils/sseManager';

const prisma = new PrismaClient();

// Helper to log activity
const logActivity = async (adminId: number, action: string, details: string) => {
    try {
        await prisma.activityLog.create({
            data: { adminId, action, details: JSON.stringify(details) }
        });
    } catch (e) {
        console.error("Failed to log activity:", e);
    }
};

// GET /users - List all users (Super Admin only)
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.admin.findMany({
            where: {
                email: { not: 'evinelias@gmail.com' }
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                permissions: true,
                isFrozen: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// POST /users - Create new user
export const createUser = async (req: Request, res: Response) => {
    const { email, password, name, role, permissions } = req.body;
    // req.user comes from authMiddleware
    const creatorId = (req as any).user?.id || 0;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.admin.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || Role.USER,
                permissions: permissions || [],
            }
        });

        await logActivity(creatorId, 'CREATE_USER', `Created user ${email}`);

        const { password: _, ...userWithoutPassword } = newUser;
        sseManager.broadcast('user_update', { action: 'create' }); // Broadcast update
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

// PUT /users/:id - Update user (Roles, Permissions, Freeze)
export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role, permissions, isFrozen, name } = req.body;
    const modifierId = (req as any).user?.id || 0;

    try {
        const targetUser = await prisma.admin.findUnique({ where: { id: Number(id) } });
        if (!targetUser) return res.status(404).json({ error: "User not found" });

        // PROTECT SUPER ADMIN: verify if target is Super Admin
        if (targetUser.role === Role.SUPER_ADMIN) {
            return res.status(403).json({ error: "Super Admin accounts cannot be modified or frozen." });
        }

        // PREVENT SELF-FREEZE
        if (Number(id) === modifierId && isFrozen === true) {
            return res.status(400).json({ error: "You cannot freeze your own account." });
        }

        const updatedUser = await prisma.admin.update({
            where: { id: Number(id) },
            data: { role, permissions, isFrozen, name }
        });

        await logActivity(modifierId, 'UPDATE_USER', `Updated user ${updatedUser.email} (Frozen: ${isFrozen}, Role: ${role})`);

        sseManager.broadcast('user_update', { action: 'update' });

        const { password: _, ...userWithoutPassword } = updatedUser;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};

// DELETE /users/:id - Delete user
export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleterId = (req as any).user?.id || 0;

    try {
        // Prevent deleting yourself
        if (Number(id) === deleterId) {
            return res.status(400).json({ error: "Cannot delete your own account" });
        }

        const userToDelete = await prisma.admin.findUnique({ where: { id: Number(id) } });
        if (!userToDelete) return res.status(404).json({ error: "User not found" });

        // PROTECT SUPER ADMIN
        if (userToDelete.role === Role.SUPER_ADMIN) {
            return res.status(403).json({ error: "Super Admin accounts cannot be deleted." });
        }

        // Clean up dependent records manually to prevent FK constraint errors
        await prisma.activityLog.deleteMany({ where: { adminId: Number(id) } });
        await prisma.leadRemark.deleteMany({ where: { adminId: Number(id) } });

        await prisma.admin.delete({ where: { id: Number(id) } });
        await logActivity(deleterId, 'DELETE_USER', `Deleted user ${userToDelete.email}`);
        sseManager.broadcast('user_update', { action: 'delete' });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

// PUT /users/:id/reset-password - Admin reset password
export const resetPassword = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { password } = req.body;
    const modifierId = (req as any).user?.id || 0;

    if (!password || password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await prisma.admin.update({
            where: { id: Number(id) },
            data: { password: hashedPassword }
        });

        await logActivity(modifierId, 'RESET_PASSWORD', `Reset password for ${updatedUser.email}`);
        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reset password' });
    }
};
