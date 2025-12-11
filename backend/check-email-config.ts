import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkConfig() {
    try {
        const config = await prisma.emailConfig.findUnique({ where: { id: 1 } });
        console.log("Current Email Config:", config);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkConfig();
