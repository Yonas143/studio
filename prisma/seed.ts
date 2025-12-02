const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const categories = [
        {
            name: 'Traditional Dance',
            slug: 'traditional-dance',
            description: 'Traditional & contemporary dance, music & drama.',
            imageUrl: '/files/dance-category.png',
            order: 1,
        },
        {
            name: 'Cultural Music & Vocal Innovation',
            slug: 'cultural-music',
            description: 'Modern production fused with Ethiopian sound.',
            imageUrl: '/files/vocal-category.png',
            order: 2,
        },
        {
            name: 'Traditional Instruments',
            slug: 'traditional-instruments',
            description: 'Creative instrumental performance & presentation.',
            imageUrl: '/files/instruments-category.png',
            order: 3,
        },
        {
            name: 'Literary & Poetry Excellence',
            slug: 'literary-poetry',
            description: 'Storytelling, poetry & written cultural expression.',
            imageUrl: '/files/poetry-category.png',
            order: 4,
        },
    ];

    console.log('Seeding categories...');

    for (const category of categories) {
        const existing = await prisma.category.findUnique({
            where: { slug: category.slug },
        });

        if (!existing) {
            await prisma.category.create({
                data: category,
            });
            console.log(`Created category: ${category.name}`);
        } else {
            await prisma.category.update({
                where: { slug: category.slug },
                data: category,
            });
            console.log(`Updated category: ${category.name}`);
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
