const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const categories = [
        {
            name: 'Traditional Dance',
            slug: 'traditional-dance',
            description: 'This category celebrates performers who bring Ethiopia’s traditional dances to life with authenticity, skill, and emotional power. Entries should reflect the unique movement styles, cultural expressions, and regional identities embedded in Ethiopia’s diverse dance heritage.',
            imageUrl: '/files/dance-category.png',
            order: 1,
        },
        {
            name: 'Traditional Music',
            slug: 'traditional-music',
            description: 'This award honors outstanding musicians who preserve and elevate Ethiopia’s cultural soundscape through traditional melodies, rhythms, and vocal styles. Performances should showcase cultural authenticity, strong musicality, and a deep respect for the roots of Ethiopian music.',
            imageUrl: '/files/vocal-category.png',
            order: 2,
        },
        {
            name: 'Traditional Instruments',
            slug: 'traditional-instruments',
            description: 'This category recognizes mastery of Ethiopia’s iconic traditional instruments — such as the Masinko, Begena, Washint, Kirar, and Kebero and others. Entries should highlight technical skill, tone quality, cultural accuracy, and the instrument’s ability to communicate emotion and heritage.',
            imageUrl: '/files/instruments-category.png',
            order: 3,
        },
        {
            name: 'Traditional Poetry (Qiné, Wax & Gold, Spoken Traditions)',
            slug: 'traditional-poetry',
            description: 'This award celebrates the poetic voices who carry forward Ethiopia’s oral traditions — from Qiné and “Wax & Gold” (Sem Ena Werq) to folk storytelling and rhythmic spoken art. Entries must reflect linguistic creativity, cultural depth, layered meaning, and strong delivery.',
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
