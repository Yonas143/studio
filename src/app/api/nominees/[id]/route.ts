import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { apiResponse, handleApiError } from '@/lib/api-utils';
import prisma from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    params: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params.params;
        const nominee = await prisma.nominee.findUnique({
            where: {
                id: id,
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
            categoryId: nomineeWithRelations.categoryId,
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

        return apiResponse(transformed);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PUT(
    request: NextRequest,
    params: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();
        const { id } = await params.params;
        const body = await request.json();
        const { name, bio, imageUrl, categoryId, scope, featured } = body;

        const nominee = await prisma.nominee.update({
            where: { id: id },
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

        return apiResponse({ success: true, nominee });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(
    request: NextRequest,
    params: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();
        const { id } = await params.params;
        
        await prisma.nominee.delete({
            where: { id: id },
        });

        return apiResponse({ success: true });
    } catch (error) {
        return handleApiError(error);
    }
}
