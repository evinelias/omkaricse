import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'admin@omkaricse.in';
    const adminPassword = 'Omkar@123admin';

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create Admin
    const admin = await prisma.admin.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            password: hashedPassword,
        },
    });

    console.log({ admin });

    // Initialize Email Config
    const emailConfig = await prisma.emailConfig.upsert({
        where: { id: 1 },
        update: {},
        create: {
            receiverEmail: 'admin@omkaricse.in',
            isEnabled: true,
        },
    });

    console.log({ emailConfig });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
