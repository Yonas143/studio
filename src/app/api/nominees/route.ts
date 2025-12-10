import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiResponse, handleApiError } from '@/lib/api-utils';
import { requireAdmin } from '@/lib/auth-helpers';

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

        return apiResponse(transformedNominees);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        await requireAdmin();

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

        return apiResponse(nominee, 201);
    } catch (error) {
        return handleApiError(error);
    }
}

