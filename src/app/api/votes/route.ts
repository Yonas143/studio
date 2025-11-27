import { NextRequest } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase/admin';
import {
    handleAPIError,
    successResponse,
    verifyAuthToken,
    verifyRole,
    ValidationError,
    NotFoundError
} from '@/lib/api/errors';
import { createVoteSchema } from '@/lib/api/validation';

/**
 * POST /api/votes
 * Cast a vote for a nominee
 */
export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        const decodedToken = await verifyAuthToken(request);
        const userId = decodedToken.uid;

        // Parse and validate request body
        const body = await request.json();
        const { nomineeId } = createVoteSchema.parse(body);

        const firestore = getAdminFirestore();

        // Check if nominee exists
        const nomineeDoc = await firestore.collection('nominees').doc(nomineeId).get();
        if (!nomineeDoc.exists) {
            throw new NotFoundError('Nominee not found');
        }

        // Check if user already voted for this nominee
        const voteId = `${userId}_${nomineeId}`;
        const existingVote = await firestore.collection('votes').doc(voteId).get();

        if (existingVote.exists) {
            throw new ValidationError('You have already voted for this nominee');
        }

        // Create vote
        await firestore.collection('votes').doc(voteId).set({
            userId,
            nomineeId,
            createdAt: new Date().toISOString(),
        });

        return successResponse({ message: 'Vote recorded successfully', voteId }, 201);
    } catch (error) {
        return handleAPIError(error);
    }
}
