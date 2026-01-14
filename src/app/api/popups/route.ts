import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { apiResponse, apiError, handleApiError, getPagination, paginatedResponse } from '@/lib/api-utils';

// Validation schema
const popupSchema = z.object({
    type: z.enum(['video', 'image', 'text']),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    videoUrl: z.string().url().optional().or(z.literal('')),
    imageUrl: z.string().url().optional().or(z.literal('')),
    imageLink: z.string().url().optional().or(z.literal('')),
    isActive: z.boolean().default(true),
    delaySeconds: z.number().int().min(0).default(2),
    storageKey: z.string().min(1, 'Storage key is required'),
});

/**
 * GET /api/popups
 * Get all popups with optional filtering
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const { skip, take, page, limit } = getPagination(searchParams);
        const isActive = searchParams.get('isActive');

        const where = isActive !== null ? { isActive: isActive === 'true' } : {};

        let [popups, total] = await Promise.all([
            prisma.popup.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.popup.count({ where }),
        ]);

        // If checking for active popups and none exist, create the default one
        if (isActive === 'true' && popups.length === 0) {
            const defaultPopup = await prisma.popup.create({
                data: {
                    type: 'video',
                    title: 'Welcome to Cultural Ambassador Award',
                    description: 'Discover the talent.',
                    videoUrl: '/files/All%20Talent%20Final%20%20(2)hand.mp4',
                    isActive: true,
                    delaySeconds: 1,
                    storageKey: 'default-welcome-popup',
                },
            });
            popups = [defaultPopup];
            total = 1;
        }

        return apiResponse(paginatedResponse(popups, total, page, limit));
    } catch (error) {
        return handleApiError(error);
    }
}

import { requireAdmin } from '@/lib/auth-helpers';

/**
 * POST /api/popups
 * Create a new popup
 */
export async function POST(request: NextRequest) {
    try {
        await requireAdmin();
        const body = await request.json();
        const validatedData = popupSchema.parse(body);

        const popup = await prisma.popup.create({
            data: {
                type: validatedData.type,
                title: validatedData.title,
                description: validatedData.description || null,
                videoUrl: validatedData.videoUrl || null,
                imageUrl: validatedData.imageUrl || null,
                imageLink: validatedData.imageLink || null,
                isActive: validatedData.isActive,
                delaySeconds: validatedData.delaySeconds,
                storageKey: validatedData.storageKey,
            },
        });

        return apiResponse(popup, 201);
    } catch (error) {
        return handleApiError(error);
    }
}

