import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function promoteUser(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.error(`User with email ${email} not found.`);
            process.exit(1);
        }

        const updatedUser = await prisma.user.update({
            where: { email },
            data: { role: 'superadmin' },
        });

        console.log(`Successfully promoted ${email} to superadmin role.`);
        console.log(updatedUser);
    } catch (error) {
        console.error('Error promoting user:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

const email = process.argv[2];

if (!email) {
    console.error('Please provide an email as an argument.');
    console.log('Usage: npx tsx scripts/promote-user.ts <email>');
    process.exit(1);
}

promoteUser(email);
