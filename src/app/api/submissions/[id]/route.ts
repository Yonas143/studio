import { NextRequest } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase/admin';
import {
    handleAPIError,
    successResponse,
    verifyAuthToken,
    verifyRole,
    NotFoundError
} from '@/lib/api/errors';
import { updateSubmissionSchema } from '@/lib/api/validation';

/**
 * PATCH /api/submissions/[id]
 * Update submission (admin/judge only)
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Verify authentication and role
        const decodedToken = await verifyAuthToken(request);
        await verifyRole(decodedToken, 'judge'); // Admin can also access (checked in verifyRole)

        const { id } = params;

        // Parse and validate request body
        const body = await request.json();
        const validatedData = updateSubmissionSchema.parse(body);

        const firestore = getAdminFirestore();
        const submissionRef = firestore.collection('submissions').doc(id);

        // Check if submission exists
        const submissionDoc = await submissionRef.get();
        if (!submissionDoc.exists) {
            throw new NotFoundError('Submission not found');
        }

        // Update submission
        await submissionRef.update({
            ...validatedData,
            updatedAt: new Date().toISOString(),
        });

        return successResponse({ message: 'Submission updated successfully' });
    } catch (error) {
        return handleAPIError(error);
    }
}
