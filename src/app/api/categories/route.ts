
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
