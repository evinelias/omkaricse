import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("--- Checking Email Config ---");
    const config = await prisma.emailConfig.findUnique({ where: { id: 1 } });
    if (config) {
        console.log(`Raw receiverEmail string: "${config.receiverEmail}"`);
        const parsed = config.receiverEmail.split(',').map(e => e.trim()).filter(e => e);
        console.log(`Parsed recipients (${parsed.length}):`, parsed);
    } else {
        console.log("Config not found!");
    }

    console.log("\n--- Checking Last 10 Email Logs ---");
    const logs = await prisma.emailLog.findMany({
        take: 10,
        orderBy: { sentAt: 'desc' }
    });

    logs.forEach(log => {
        console.log(`[${log.status}] To: ${log.recipient} | Subject: ${log.subject} | Time: ${log.sentAt.toISOString()}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
