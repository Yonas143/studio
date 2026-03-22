import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiResponse, handleApiError } from '@/lib/api-utils';
import { requireAdmin } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
    try {
        await requireAdmin();

        const [nominees, votes, categories] = await Promise.all([
            prisma.nominee.findMany({
                include: { category: true }
            }),
            prisma.vote.findMany({
                orderBy: { createdAt: 'asc' }
            }),
            prisma.category.findMany()
        ]);

        return apiResponse({ nominees, votes, categories });
    } catch (error) {
        return handleApiError(error);
    }
}
