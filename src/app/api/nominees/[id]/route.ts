import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const nominee = await prisma.nominee.findUnique({
            where: {
                id: params.id,
                isActive: true,
            },
            include: {
                category: true,
                media: {
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
        });

        if (!nominee) {
            return NextResponse.json({ error: 'Nominee not found' }, { status: 404 });
        }

        // Transform to match frontend Nominee type
        const nomineeWithRelations = nominee as typeof nominee & {
            category: { name: string };
            media: Array<{ type: string; url: string; thumbnail: string; description: string; hint: string | null }>;
        };

        const transformed = {
            id: nomineeWithRelations.id,
            name: nomineeWithRelations.name,
            category: nomineeWithRelations.category.name,
            region: 'Ethiopia', // Default for now
            scope: nomineeWithRelations.scope as 'ethiopia' | 'worldwide',
            bio: nomineeWithRelations.bio || '',
            imageId: '', // Not used anymore
            imageUrl: nomineeWithRelations.imageUrl,
            media: nomineeWithRelations.media.map((m) => ({
                type: m.type as 'image' | 'video' | 'audio',
                url: m.url,
                thumbnail: m.thumbnail,
                description: m.description,
                hint: m.hint || '',
            })),
            votes: nomineeWithRelations.voteCount,
            featured: nomineeWithRelations.featured,
        };

        return NextResponse.json(transformed);
    } catch (error) {
        console.error('Error fetching nominee:', error);
        return NextResponse.json({ error: 'Failed to fetch nominee' }, { status: 500 });
    }
}
