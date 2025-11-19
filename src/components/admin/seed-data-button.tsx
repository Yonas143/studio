'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Database } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Demo data
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

const nominees = [
    {
        id: 'nominee-1',
        name: 'Alemayehu Tadesse',
        category: 'Traditional Music',
        region: 'Addis Ababa',
        bio: 'Master krar player preserving ancient Ethiopian musical traditions while innovating new techniques. With over 20 years of experience, Alemayehu has performed at cultural festivals across Ethiopia and internationally.',
        imageId: 'nominee-alemayehu',
        media: [],
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
        media: [],
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
        media: [],
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
        media: [],
        votes: 0,
        featured: true,
    },
];

export function SeedDataButton() {
    const [isSeeding, setIsSeeding] = useState(false);
    const [progress, setProgress] = useState('');
    const firestore = useFirestore();
    const { toast } = useToast();

    const seedData = async () => {
        setIsSeeding(true);
        setProgress('Starting data seeding...');

        try {
            // Seed categories
            setProgress('Seeding categories...');
            for (const category of categories) {
                await setDoc(doc(firestore, 'categories', category.id), category);
            }

            // Seed timeline events
            setProgress('Seeding timeline events...');
            for (const event of timelineEvents) {
                await setDoc(doc(firestore, 'timelineEvents', event.id), event);
            }

            // Seed nominees
            setProgress('Seeding nominees...');
            for (const nominee of nominees) {
                await setDoc(doc(firestore, 'nominees', nominee.id), nominee);
            }

            setProgress('✅ Data seeding completed successfully!');
            toast({
                title: 'Success',
                description: `Seeded ${categories.length} categories, ${timelineEvents.length} timeline events, and ${nominees.length} nominees.`,
            });
        } catch (error: any) {
            console.error('Error seeding data:', error);
            setProgress('❌ Error seeding data');
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'Failed to seed data',
            });
        } finally {
            setIsSeeding(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Seed Demo Data
                </CardTitle>
                <CardDescription>
                    Populate the database with sample categories, timeline events, and nominees.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {progress && (
                    <Alert>
                        <AlertTitle>Progress</AlertTitle>
                        <AlertDescription>{progress}</AlertDescription>
                    </Alert>
                )}
                <Button onClick={seedData} disabled={isSeeding} className="w-full">
                    {isSeeding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSeeding ? 'Seeding Data...' : 'Seed Database'}
                </Button>
                <p className="text-sm text-muted-foreground">
                    This will add {categories.length} categories, {timelineEvents.length} timeline events, and {nominees.length} nominees to Firestore.
                </p>
            </CardContent>
        </Card>
    );
}
