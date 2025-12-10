import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';
import { apiResponse, handleApiError } from '@/lib/api-utils';

/**
 * GET /api/admin/stats
 * Get dashboard statistics (admin only)
 */
export async function GET(request: NextRequest) {
    try {
        // Verify authentication and admin role
        await requireAdmin();

        // Get counts for all collections
        const [
            participantsCount,
            submissionsCount,
            votesCount,
            nomineesCount,
            categoriesCount,
            pendingSubmissions,
            approvedSubmissions,
            rejectedSubmissions
        ] = await Promise.all([
            prisma.user.count({ where: { role: 'participant' } }),
            prisma.submission.count(),
            prisma.vote.count(),
            prisma.nominee.count(),
            prisma.category.count(),
            prisma.submission.count({ where: { status: 'pending' } }),
            prisma.submission.count({ where: { status: 'approved' } }),
            prisma.submission.count({ where: { status: 'rejected' } }),
        ]);

        const stats = {
            users: {
                total: participantsCount,
                participants: participantsCount,
            },
            submissions: {
                total: submissionsCount,
                byStatus: {
                    Pending: pendingSubmissions,
                    Approved: approvedSubmissions,
                    Rejected: rejectedSubmissions
                },
            },
            votes: {
                total: votesCount,
            },
            nominees: {
                total: nomineesCount,
            },
            categories: {
                total: categoriesCount,
            },
        };

        return apiResponse(stats);
    } catch (error) {
        return handleApiError(error);
    }
}

