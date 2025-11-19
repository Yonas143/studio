/**
 * Seed script to populate Firestore with demo data
 * Run with: npm run seed
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
if (!getApps().length) {
    initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
}

const db = getFirestore();

// Categories data
const categories = [
    {
        id: 'performing-arts',
        name: 'Performing Arts',
        description: 'Traditional and contemporary Ethiopian dance, theater, and performance art celebrating our rich cultural heritage.',
        imageId: 'category-performing-arts',
    },
    {
        id: 'traditional-music',
        name: 'Traditional Music',
        description: 'Authentic Ethiopian music featuring traditional instruments like the krar, masenqo, and washint.',
        imageId: 'category-traditional-music',
    },
    {
        id: 'digital-music',
        name: 'Digital Music',
        description: 'Modern Ethiopian music blending traditional sounds with contemporary genres and digital production.',
        imageId: 'category-digital-music',
    },
    {
        id: 'poetry',
        name: 'Poetry',
        description: 'Spoken word and written poetry in Amharic, Oromo, Tigrinya, and other Ethiopian languages.',
        imageId: 'category-poetry',
    },
];

// Timeline events
const timelineEvents = [
    {
        id: 'submissions-open',
        date: 'January 15, 2025',
        title: 'Submissions Open',
        description: 'Artists can begin submitting their work across all categories.',
        order: 1,
    },
    {
        id: 'submissions-close',
        date: 'March 1, 2025',
        title: 'Submissions Close',
        description: 'Final deadline for all submissions.',
        order: 2,
    },
    {
        id: 'judging-period',
        date: 'March 5-20, 2025',
        title: 'Judging Period',
        description: 'Expert judges review and score all submissions.',
        order: 3,
    },
    {
        id: 'public-voting',
        date: 'March 25 - April 10, 2025',
        title: 'Public Voting Opens',
        description: 'The public can vote for their favorite nominees.',
        order: 4,
    },
    {
        id: 'winners-announced',
        date: 'April 20, 2025',
        title: 'Winners Announced',
        description: 'Award ceremony celebrating Ethiopian cultural excellence.',
        order: 5,
    },
];

// Sample nominees
const nominees = [
    {
        id: 'nominee-1',
        name: 'Alemayehu Tadesse',
        category: 'Traditional Music',
        region: 'Addis Ababa',
        bio: 'Master krar player preserving ancient Ethiopian musical traditions while innovating new techniques. With over 20 years of experience, Alemayehu has performed at cultural festivals across Ethiopia and internationally.',
        imageId: 'nominee-alemayehu',
        media: [
            {
                type: 'audio',
                url: 'https://example.com/alemayehu-performance.mp3',
                thumbnail: 'https://example.com/alemayehu-thumb.jpg',
                description: 'Traditional krar performance',
                hint: 'Ethiopian musician playing krar instrument',
            },
        ],
        votes: 0,
        featured: true,
    },
    {
        id: 'nominee-2',
        name: 'Tigist Bekele',
        category: 'Performing Arts',
        region: 'Gondar',
        bio: 'Contemporary dancer blending Eskista with modern choreography. Tigist founded the Gondar Youth Dance Collective, training the next generation of Ethiopian performers.',
        imageId: 'nominee-tigist',
        media: [
            {
                type: 'video',
                url: 'https://example.com/tigist-dance.mp4',
                thumbnail: 'https://example.com/tigist-thumb.jpg',
                description: 'Eskista fusion performance',
                hint: 'Ethiopian dancer performing traditional Eskista',
            },
        ],
        votes: 0,
        featured: true,
    },
    {
        id: 'nominee-3',
        name: 'Dawit Mekonnen',
        category: 'Digital Music',
        region: 'Dire Dawa',
        bio: 'Producer and artist fusing Ethiopian pentatonic scales with electronic music. His debut album "Habesha Beats" has gained international recognition.',
        imageId: 'nominee-dawit',
        media: [
            {
                type: 'audio',
                url: 'https://example.com/dawit-track.mp3',
                thumbnail: 'https://example.com/dawit-thumb.jpg',
                description: 'Electronic fusion track',
                hint: 'Ethiopian music producer in studio',
            },
        ],
        votes: 0,
        featured: true,
    },
    {
        id: 'nominee-4',
        name: 'Hiwot Gebremedhin',
        category: 'Poetry',
        region: 'Mekelle',
        bio: 'Spoken word poet addressing social issues through powerful Tigrinya and Amharic verse. Winner of multiple poetry slams and cultural festivals.',
        imageId: 'nominee-hiwot',
        media: [
            {
                type: 'video',
                url: 'https://example.com/hiwot-poetry.mp4',
                thumbnail: 'https://example.com/hiwot-thumb.jpg',
                description: 'Spoken word performance',
                hint: 'Ethiopian poet performing spoken word',
            },
        ],
        votes: 0,
        featured: true,
    },
    {
        id: 'nominee-5',
        name: 'Yohannes Asfaw',
        category: 'Traditional Music',
        region: 'Bahir Dar',
        bio: 'Masenqo virtuoso and cultural educator teaching traditional Ethiopian music to youth. Yohannes has documented over 100 traditional songs from the Amhara region.',
        imageId: 'nominee-yohannes',
        media: [
            {
                type: 'audio',
                url: 'https://example.com/yohannes-masenqo.mp3',
                thumbnail: 'https://example.com/yohannes-thumb.jpg',
                description: 'Masenqo traditional piece',
                hint: 'Ethiopian musician playing masenqo',
            },
        ],
        votes: 0,
        featured: false,
    },
    {
        id: 'nominee-6',
        name: 'Selamawit Hailu',
        category: 'Performing Arts',
        region: 'Hawassa',
        bio: 'Theater director and actress bringing Ethiopian folktales to the stage. Her production of "The Lion and the Hare" toured 15 Ethiopian cities.',
        imageId: 'nominee-selamawit',
        media: [
            {
                type: 'video',
                url: 'https://example.com/selamawit-theater.mp4',
                thumbnail: 'https://example.com/selamawit-thumb.jpg',
                description: 'Theater performance excerpt',
                hint: 'Ethiopian theater actress on stage',
            },
        ],
        votes: 0,
        featured: false,
    },
];

// Sample submissions
const submissions = [
    {
        id: 'submission-1',
        title: 'Echoes of Lalibela',
        categoryId: 'traditional-music',
        submitterId: 'user-sample-1',
        culturalRelevance: 'This piece draws inspiration from the ancient rock-hewn churches of Lalibela, using traditional instruments to evoke the spiritual atmosphere of this UNESCO World Heritage site. The composition incorporates liturgical chants and rhythms from Ethiopian Orthodox traditions.',
        mediaUrl: 'https://example.com/echoes-lalibela.mp3',
        status: 'Pending',
        createdAt: new Date('2025-02-15').toISOString(),
    },
    {
        id: 'submission-2',
        title: 'Digital Addis',
        categoryId: 'digital-music',
        submitterId: 'user-sample-2',
        culturalRelevance: 'A modern take on Ethiopian music that samples traditional instruments and vocal styles, blending them with contemporary electronic production. The track represents the vibrant, evolving culture of urban Ethiopia.',
        mediaUrl: 'https://example.com/digital-addis.mp3',
        status: 'Approved',
        createdAt: new Date('2025-02-10').toISOString(),
    },
    {
        id: 'submission-3',
        title: 'Mothers of Ethiopia',
        categoryId: 'poetry',
        submitterId: 'user-sample-3',
        culturalRelevance: 'A powerful spoken word piece honoring Ethiopian women throughout history, from Queen Sheba to contemporary activists. Written in Amharic with English subtitles, celebrating the strength and resilience of Ethiopian mothers.',
        mediaUrl: 'https://example.com/mothers-ethiopia.mp4',
        status: 'Approved',
        createdAt: new Date('2025-02-20').toISOString(),
    },
];

async function seedData() {
    console.log('🌱 Starting data seeding...\n');

    try {
        // Seed categories
        console.log('📁 Seeding categories...');
        for (const category of categories) {
            await db.collection('categories').doc(category.id).set(category);
            console.log(`  ✓ Added category: ${category.name}`);
        }

        // Seed timeline events
        console.log('\n📅 Seeding timeline events...');
        for (const event of timelineEvents) {
            await db.collection('timelineEvents').doc(event.id).set(event);
            console.log(`  ✓ Added event: ${event.title}`);
        }

        // Seed nominees
        console.log('\n👥 Seeding nominees...');
        for (const nominee of nominees) {
            await db.collection('nominees').doc(nominee.id).set(nominee);
            console.log(`  ✓ Added nominee: ${nominee.name} (${nominee.category})`);
        }

        // Seed submissions
        console.log('\n📝 Seeding submissions...');
        for (const submission of submissions) {
            await db.collection('submissions').doc(submission.id).set(submission);
            console.log(`  ✓ Added submission: ${submission.title}`);
        }

        console.log('\n✅ Data seeding completed successfully!');
        console.log('\nSummary:');
        console.log(`  - ${categories.length} categories`);
        console.log(`  - ${timelineEvents.length} timeline events`);
        console.log(`  - ${nominees.length} nominees`);
        console.log(`  - ${submissions.length} submissions`);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
}

// Run the seed function
seedData()
    .then(() => {
        console.log('\n🎉 All done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
