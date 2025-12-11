import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const testLogin = async () => {
    console.log("Testing Admin Login...");
    const email = "admin@omkaricse.in";
    const password = "Omkar@123admin";

    try {
        console.log(`Searching for user: ${email}`);
        const admin = await prisma.admin.findUnique({ where: { email } });

        if (!admin) {
            console.error("FAILURE: User not found in database.");
            return;
        }
        console.log("SUCCESS: User found.");

        console.log("Verifying password...");
        const isMatch = await bcrypt.compare(password, admin.password);

        if (isMatch) {
            console.log("SUCCESS: Password is correct.");
        } else {
            console.error("FAILURE: Password mismatch.");
            console.log("Stored Hash:", admin.password);
            // specific check for common issues
            const isPlain = password === admin.password;
            if (isPlain) console.log("WARNING: Stored password seems to be plain text, not hashed.");
        }
    } catch (error) {
        console.error("Database Error:", error);
    } finally {
        await prisma.$disconnect();
    }
};

testLogin();
