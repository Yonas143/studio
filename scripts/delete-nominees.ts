import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Deleting all existing nominees...');
    
    // Deleting nominees will trigger cascading deletes on Votes, Payments, and NomineeMedia
    const result = await prisma.nominee.deleteMany({});
    
    console.log(`Successfully deleted ${result.count} nominees from the database.`);
}

main()
    .catch((e) => {
        console.error('Error deleting nominees:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
