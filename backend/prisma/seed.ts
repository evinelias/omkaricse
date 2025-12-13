import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // 1. Primary Admin (omkaricse)
    const email = 'admin@omkaricse.in';
    const password = 'Omkar@123admin'; // Requested Password
    const hashedPassword = await bcrypt.hash(password, 10);

    const mainAdmin = await prisma.admin.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: Role.SUPER_ADMIN,
            // Keep "Super Admin" for the main school account, or change if requested.
            // The user said "both ... are shown as Super Admin which is confusing", implies differentiation.
            // I'll rename this to "Omkar Admin" to be clearer? 
            // Or "Principal"? The user only asked to rename Evin.
            // I'll stick to "Super Admin" for this one but "Evin" for the other.
            name: 'Super Admin',
            permissions: ['LEADS', 'EMAIL', 'USERS', 'ACTIVITY'],
        },
        create: {
            email,
            password: hashedPassword,
            name: 'Super Admin',
            role: Role.SUPER_ADMIN,
            permissions: ['LEADS', 'EMAIL', 'USERS', 'ACTIVITY'],
        }
    });
    console.log(`Upserted Main Admin: ${mainAdmin.email}`);

    // 2. Hidden Admin (Evin)
    const hiddenEmail = 'evinelias@gmail.com';
    const hiddenPassword = 'Muskan@786';
    const hiddenHash = await bcrypt.hash(hiddenPassword, 10);

    const evinAdmin = await prisma.admin.upsert({
        where: { email: hiddenEmail },
        update: {
            password: hiddenHash,
            name: 'Evin', // Explicitly requested rename
            role: Role.SUPER_ADMIN,
            permissions: ['LEADS', 'EMAIL', 'USERS', 'ACTIVITY'],
        },
        create: {
            email: hiddenEmail,
            password: hiddenHash,
            name: 'Evin',
            role: Role.SUPER_ADMIN,
            permissions: ['LEADS', 'EMAIL', 'USERS', 'ACTIVITY'],
        }
    });
    console.log(`Upserted Developer Admin: ${evinAdmin.email} as '${evinAdmin.name}'`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
