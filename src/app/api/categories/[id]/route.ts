
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiResponse, handleApiError, apiError } from '@/lib/api-utils';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { name, description, imageUrl, isActive } = body;

        // Check if category exists
        const existingCategory = await prisma.category.findUnique({
            where: { id: params.id },
        });

        if (!existingCategory) {
            return apiError('Category not found', 404);
        }

        const category = await prisma.category.update({
            where: { id: params.id },
            data: {
                name,
                description,
                imageUrl,
                isActive,
            },
        });

        return apiResponse(category);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.category.delete({
            where: { id: params.id },
        });

        return apiResponse({ success: true });
    } catch (error) {
        return handleApiError(error);
    }
}
