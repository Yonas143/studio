import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { apiResponse, apiError, handleApiError } from '@/lib/api-utils';

// Validation schema for updates
const popupUpdateSchema = z.object({
    type: z.enum(['video', 'image', 'text']).optional(),
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    videoUrl: z.string().url().optional().or(z.literal('')),
    imageUrl: z.string().url().optional().or(z.literal('')),
    imageLink: z.string().url().optional().or(z.literal('')),
    isActive: z.boolean().optional(),
    delaySeconds: z.number().int().min(0).optional(),
    storageKey: z.string().min(1).optional(),
});

/**
 * GET /api/popups/[id]
 * Get a single popup by ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const popup = await prisma.popup.findUnique({
            where: { id: params.id },
        });

        if (!popup) {
            return apiError('Popup not found', 404);
        }

        return apiResponse(popup);
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * PUT /api/popups/[id]
 * Update a popup
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const validatedData = popupUpdateSchema.parse(body);

        const popup = await prisma.popup.update({
            where: { id: params.id },
            data: validatedData,
        });

        return apiResponse(popup);
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * DELETE /api/popups/[id]
 * Delete a popup
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.popup.delete({
            where: { id: params.id },
        });

        return apiResponse({ message: 'Popup deleted successfully' });
    } catch (error) {
        return handleApiError(error);
    }
}
