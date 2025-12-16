
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
    {
        name: 'Performing Arts',
        slug: 'performing-arts',
        description: 'Traditional and contemporary Ethiopian dance, theater, and performance art celebrating our rich cultural heritage.',
        imageUrl: '/images/performing-arts.jpg',
        order: 1,
        isActive: true,
    },
    {
        name: 'Traditional Music',
        slug: 'traditional-music',
        description: 'Authentic Ethiopian music featuring traditional instruments like the krar, masenqo, and washint.',
        imageUrl: '/images/traditional-music.jpg',
        order: 2,
        isActive: true,
    },
    {
        name: 'Digital Music',
        slug: 'digital-music',
        description: 'Modern Ethiopian music blending traditional sounds with contemporary genres and digital production.',
        imageUrl: '/images/digital-music.jpg',
        order: 3,
        isActive: true,
    },
    {
        name: 'Poetry',
        slug: 'poetry',
        description: 'Spoken word and written poetry in Amharic, Oromo, Tigrinya, and other Ethiopian languages.',
        imageUrl: '/images/poetry.jpg',
        order: 4,
        isActive: true,
    },
];

const nominees = [
    // Performing Arts
    {
        name: 'Melaku Belay',
        categorySlug: 'performing-arts',
        region: 'Addis Ababa',
        bio: 'World-renowned dancer and cultural ambassador, founder of Fendika Cultural Center.',
        imageUrl: '/images/nominees/melaku.jpg',
        scope: 'ethiopia',
        featured: true,
    },
    {
        name: 'Addis Gezahegn',
        categorySlug: 'performing-arts',
        region: 'Gondar',
        bio: 'Celebrated for her mastery of Eskista and traditional Gondar dances.',
        imageUrl: '/images/nominees/addis.jpg',
        scope: 'ethiopia',
        featured: false,
    },
    // Traditional Music
    {
        name: 'Hachalu Hundessa',
        categorySlug: 'traditional-music',
        region: 'Oromia',
        bio: 'Late icon whose music resonated with the heartbeat of a generation.',
        imageUrl: '/images/nominees/hachalu.jpg',
        scope: 'ethiopia',
        featured: true,
    },
    {
        name: 'Mulatu Astatke',
        categorySlug: 'traditional-music',
        region: 'Addis Ababa',
        bio: 'The father of Ethio-Jazz, blending traditional Ethiopian music with jazz and Latin rhythms.',
        imageUrl: '/images/nominees/mulatu.jpg',
        scope: 'worldwide',
        featured: true,
    },
    // Digital Music
    {
        name: 'Rophnan Nuri',
        categorySlug: 'digital-music',
        region: 'Addis Ababa',
        bio: 'Pioneering electronic music producer merging traditional sounds with futuristic beats.',
        imageUrl: '/images/nominees/rophnan.jpg',
        scope: 'ethiopia',
        featured: true,
    },
    {
        name: 'Jano Band',
        categorySlug: 'digital-music',
        region: 'Addis Ababa',
        bio: 'Rock fusion band bringing a new energy to Ethiopian music.',
        imageUrl: '/images/nominees/jano.jpg',
        scope: 'ethiopia',
        featured: false,
    },
    // Poetry
    {
        name: 'Bewketu Seyoum',
        categorySlug: 'poetry',
        region: 'Debre Markos',
        bio: 'Acclaimed poet and novelist known for his humorous yet poignant social commentary.',
        imageUrl: '/images/nominees/bewketu.jpg',
        scope: 'ethiopia',
        featured: true,
    },
    {
        name: 'Lemn Sissay',
        categorySlug: 'poetry',
        region: 'United Kingdom',
        bio: 'Award-winning poet and playwright connecting the Ethiopian diaspora through words.',
        imageUrl: '/images/nominees/lemn.jpg',
        scope: 'worldwide',
        featured: false,
    },
];

async function main() {
    console.log('🌱 Starting seeding...');

    // Seed Categories
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
            console.log(`Category already exists: ${category.name}`);
        }
    }

    // Seed Nominees
    for (const nominee of nominees) {
        // Find category ID
        const category = await prisma.category.findUnique({
            where: { slug: nominee.categorySlug },
        });

        if (category) {
            // Check if nominee exists
            const existing = await prisma.nominee.findFirst({
                where: { name: nominee.name, categoryId: category.id },
            });

            if (!existing) {
                await prisma.nominee.create({
                    data: {
                        name: nominee.name,
                        categoryId: category.id,
                        region: nominee.region,
                        bio: nominee.bio,
                        imageUrl: nominee.imageUrl,
                        scope: nominee.scope,
                        featured: nominee.featured,
                    }
                });
                console.log(`Created nominee: ${nominee.name}`);
            } else {
                console.log(`Nominee already exists: ${nominee.name}`);
            }
        } else {
            console.log(`Category not found for nominee: ${nominee.name}`);
        }
    }

    console.log('✅ Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
