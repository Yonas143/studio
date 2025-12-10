import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';
import { apiResponse, handleApiError } from '@/lib/api-utils';
import { updateSubmissionSchema } from '@/lib/api/validation';

/**
 * PATCH /api/submissions/[id]
 * Update submission (admin only)
 */
export async function PATCH(
    request: NextRequest,
    params: { params: Promise<{ id: string }> }
) {
    try {
        // Verify authentication and role
        await requireAdmin();

        const { id } = await params.params;

        // Parse and validate request body
        const body = await request.json();
        const validatedData = updateSubmissionSchema.parse(body);

        // Update submission
        await prisma.submission.update({
            where: { id },
            data: validatedData
        });

        return apiResponse({ message: 'Submission updated successfully' });
    } catch (error) {
        return handleApiError(error);
    }
}

