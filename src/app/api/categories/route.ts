
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiResponse, handleApiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
    try {
        const categories = await prisma.category.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                order: 'asc',
            },
        });

        return apiResponse(categories);
    } catch (error) {
        return handleApiError(error);
    }
}

import { requireAdmin } from '@/lib/auth-helpers';

export async function POST(request: NextRequest) {
    try {
        await requireAdmin();
        const body = await request.json();
        const { name, description, imageUrl } = body;

        // Simple slug generation
        const slug = name
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');

        const category = await prisma.category.create({
            data: {
                name,
                slug,
                description,
                imageUrl,
                isActive: true,
                order: 99, // Default order, can be managed later
            },
        });

        return apiResponse(category, 201);
    } catch (error) {
        return handleApiError(error);
    }
}
