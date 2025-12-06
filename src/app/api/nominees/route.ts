import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        const scope = searchParams.get('scope');

        const nominees = await prisma.nominee.findMany({
            where: {
                isActive: true,
                ...(categoryId && { categoryId }),
                ...(scope && scope !== 'all' && { scope }),
                ...(searchParams.get('featured') === 'true' && { featured: true }),
            },
            include: {
                category: true,
                media: {
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
            orderBy: {
                voteCount: 'desc',
            },
        });

        // Transform to match frontend Nominee type
        const transformedNominees = nominees.map(nominee => {
            const nomineeWithRelations = nominee as typeof nominee & {
                category: { name: string };
                media: Array<{ type: string; url: string; thumbnail: string; description: string; hint: string | null }>;
            };

            return {
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
        });

        return NextResponse.json(transformedNominees);
    } catch (error) {
        console.error('Error fetching nominees:', error);
        return NextResponse.json({ error: 'Failed to fetch nominees' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, bio, imageUrl, categoryId, scope, media } = body;

        const nominee = await prisma.nominee.create({
            data: {
                name,
                bio,
                imageUrl,
                categoryId,
                scope: scope || 'ethiopia',
                media: {
                    create: media?.map((m: any, index: number) => ({
                        type: m.type,
                        url: m.url,
                        thumbnail: m.thumbnail,
                        description: m.description,
                        hint: m.hint,
                        order: index,
                    })) || [],
                },
            },
            include: {
                category: true,
                media: true,
            },
        });

        return NextResponse.json({ success: true, nominee }, { status: 201 });
    } catch (error) {
        console.error('Error creating nominee:', error);
        return NextResponse.json({ error: 'Failed to create nominee' }, { status: 500 });
    }
}
