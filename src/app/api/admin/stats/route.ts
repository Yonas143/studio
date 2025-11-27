import { NextRequest } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase/admin';
import {
    handleAPIError,
    successResponse,
    verifyAuthToken,
    verifyRole
} from '@/lib/api/errors';

/**
 * GET /api/admin/stats
 * Get dashboard statistics (admin only)
 */
export async function GET(request: NextRequest) {
    try {
        // Verify authentication and admin role
        const decodedToken = await verifyAuthToken(request);
        await verifyRole(decodedToken, 'admin');

        const firestore = getAdminFirestore();

        // Get counts for all collections
        const [
            participantsSnapshot,
            judgesSnapshot,
            submissionsSnapshot,
            votesSnapshot,
            nomineesSnapshot,
            categoriesSnapshot,
        ] = await Promise.all([
            firestore.collection('users').where('role', '==', 'participant').get(),
            firestore.collection('users').where('role', '==', 'judge').get(),
            firestore.collection('submissions').get(),
            firestore.collection('votes').get(),
            firestore.collection('nominees').get(),
            firestore.collection('categories').get(),
        ]);

        // Get submission status breakdown
        const submissionsByStatus = {
            Pending: 0,
            Approved: 0,
            Rejected: 0,
        };

        submissionsSnapshot.docs.forEach(doc => {
            const status = doc.data().status as keyof typeof submissionsByStatus;
            if (status in submissionsByStatus) {
                submissionsByStatus[status]++;
            }
        });

        const stats = {
            users: {
                total: participantsSnapshot.size + judgesSnapshot.size,
                participants: participantsSnapshot.size,
                judges: judgesSnapshot.size,
            },
            submissions: {
                total: submissionsSnapshot.size,
                byStatus: submissionsByStatus,
            },
            votes: {
                total: votesSnapshot.size,
            },
            nominees: {
                total: nomineesSnapshot.size,
            },
            categories: {
                total: categoriesSnapshot.size,
            },
        };

        return successResponse(stats);
    } catch (error) {
        return handleAPIError(error);
    }
}
