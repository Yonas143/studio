import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { apiResponse, handleApiError } from '@/lib/api-utils';

/**
 * DELETE /api/votes/[nomineeId]
 * Remove a vote for a nominee
 */
export async function DELETE(
    request: NextRequest,
    params: { params: Promise<{ nomineeId: string }> }
) {
    try {
        // Verify authentication
        const userId = await requireAuth();
        const { nomineeId } = await params.params;

        // Delete vote where user and nominee match
        await prisma.vote.deleteMany({
            where: {
                userId: userId,
                nomineeId: nomineeId
            }
        });

        return apiResponse({ message: 'Vote removed successfully' });
    } catch (error) {
        return handleApiError(error);
    }
}

