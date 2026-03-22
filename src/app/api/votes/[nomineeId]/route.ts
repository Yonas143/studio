import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';
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
        // Verify admin authentication
        await requireAdmin();
        const { nomineeId } = await params.params;

        // Delete votes for this nominee (Admin only action)
        await prisma.vote.deleteMany({
            where: {
                nomineeId: nomineeId
            }
        });

        return apiResponse({ message: 'Votes removed successfully' });
    } catch (error) {
        return handleApiError(error);
    }
}

