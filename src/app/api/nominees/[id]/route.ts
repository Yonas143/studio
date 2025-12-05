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
        const transformed = {
            id: nominee.id,
            name: nominee.name,
            category: nominee.category.name,
            region: 'Ethiopia', // Default for now
            scope: nominee.scope,
            bio: nominee.bio || '',
            imageId: '', // Not used anymore
            imageUrl: nominee.imageUrl,
            media: nominee.media.map(m => ({
                type: m.type as 'image' | 'video' | 'audio',
                url: m.url,
                thumbnail: m.thumbnail,
                description: m.description,
                hint: m.hint || '',
            })),
            votes: nominee.voteCount,
            featured: nominee.featured,
        };

        return NextResponse.json(transformed);
    } catch (error) {
        console.error('Error fetching nominee:', error);
        return NextResponse.json({ error: 'Failed to fetch nominee' }, { status: 500 });
    }
}
