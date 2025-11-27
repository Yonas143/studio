import { NextRequest } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase/admin';
import {
    handleAPIError,
    successResponse,
    verifyAuthToken,
    NotFoundError
} from '@/lib/api/errors';

/**
 * DELETE /api/votes/[nomineeId]
 * Remove a vote for a nominee
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { nomineeId: string } }
) {
    try {
        // Verify authentication
        const decodedToken = await verifyAuthToken(request);
        const userId = decodedToken.uid;
        const { nomineeId } = params;

        const firestore = getAdminFirestore();
        const voteId = `${userId}_${nomineeId}`;

        // Check if vote exists
        const voteDoc = await firestore.collection('votes').doc(voteId).get();
        if (!voteDoc.exists) {
            throw new NotFoundError('Vote not found');
        }

        // Delete vote
        await firestore.collection('votes').doc(voteId).delete();

        return successResponse({ message: 'Vote removed successfully' });
    } catch (error) {
        return handleAPIError(error);
    }
}
