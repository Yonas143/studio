import { NextRequest } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase/admin';
import {
    handleAPIError,
    successResponse,
    verifyAuthToken,
    verifyRole
} from '@/lib/api/errors';
import { createSubmissionSchema, submissionQuerySchema } from '@/lib/api/validation';

/**
 * POST /api/submissions
 * Create a new submission
 */
export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        const decodedToken = await verifyAuthToken(request);
        const userId = decodedToken.uid;

        // Parse and validate request body
        const body = await request.json();
        const validatedData = createSubmissionSchema.parse(body);

        const firestore = getAdminFirestore();

        // Create submission
        const submissionData = {
            ...validatedData,
            submitterId: userId,
            status: 'Pending',
            createdAt: new Date().toISOString(),
        };

        const docRef = await firestore.collection('submissions').add(submissionData);

        return successResponse({
            message: 'Submission created successfully',
            submissionId: docRef.id
        }, 201);
    } catch (error) {
        return handleAPIError(error);
    }
}

/**
 * GET /api/submissions
 * List submissions (filtered by user role)
 */
export async function GET(request: NextRequest) {
    try {
        // Verify authentication
        const decodedToken = await verifyAuthToken(request);
        const userId = decodedToken.uid;
        const userRole = decodedToken.role as string;

        const { searchParams } = new URL(request.url);
        const query = submissionQuerySchema.parse({
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
            status: searchParams.get('status'),
            categoryId: searchParams.get('categoryId'),
        });

        const firestore = getAdminFirestore();
        let submissionsQuery = firestore.collection('submissions');

        // Filter by user role
        if (userRole === 'participant') {
            // Participants can only see their own submissions
            submissionsQuery = submissionsQuery.where('submitterId', '==', userId) as any;
        }

        // Apply additional filters
        if (query.status) {
            submissionsQuery = submissionsQuery.where('status', '==', query.status) as any;
        }
        if (query.categoryId) {
            submissionsQuery = submissionsQuery.where('categoryId', '==', query.categoryId) as any;
        }

        // Order by creation date
        submissionsQuery = submissionsQuery.orderBy('createdAt', 'desc') as any;

        // Get submissions
        const snapshot = await submissionsQuery.get();
        const submissions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Apply pagination
        const start = (query.page - 1) * query.limit;
        const end = start + query.limit;
        const paginatedSubmissions = submissions.slice(start, end);

        return successResponse({
            submissions: paginatedSubmissions,
            pagination: {
                page: query.page,
                limit: query.limit,
                total: submissions.length,
                totalPages: Math.ceil(submissions.length / query.limit),
            },
        });
    } catch (error) {
        return handleAPIError(error);
    }
}
