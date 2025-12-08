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
            category: nomineeWithRelations.category.name,
            region: nomineeWithRelations.region || 'Ethiopia',
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

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { name, bio, imageUrl, categoryId, scope, featured } = body;

        const nominee = await prisma.nominee.update({
            where: { id: params.id },
            data: {
                name,
                bio,
                imageUrl,
                categoryId,
                scope,
                featured,
            },
            include: {
                category: true,
                media: true,
            },
        });

        return NextResponse.json({ success: true, nominee });
    } catch (error) {
        console.error('Error updating nominee:', error);
        return NextResponse.json({ error: 'Failed to update nominee' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.nominee.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting nominee:', error);
        return NextResponse.json({ error: 'Failed to delete nominee' }, { status: 500 });
    }
}
