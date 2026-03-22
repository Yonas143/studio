import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiResponse, handleApiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        const limit = parseInt(searchParams.get('limit') || '10');

        const nominees = await prisma.nominee.findMany({
            where: {
                isActive: true,
                ...(categoryId && { categoryId }),
            },
            include: {
                category: true,
            },
            orderBy: {
                voteCount: 'desc',
            },
            take: limit,
        });

        const leaders = nominees.map((nominee) => ({
            nomineeId: nominee.id,
            nomineeName: nominee.name,
            category: nominee.category.name,
            voteCount: nominee.voteCount,
        }));

        return apiResponse(leaders);
    } catch (error) {
        return handleApiError(error);
    }
}
