import { NextRequest } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase/admin';
import {
    handleAPIError,
    successResponse,
    verifyAuthToken,
    NotFoundError
} from '@/lib/api/errors';
import { nomineeQuerySchema } from '@/lib/api/validation';

/**
 * GET /api/nominees
 * List all nominees with optional filtering
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = nomineeQuerySchema.parse({
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
            category: searchParams.get('category'),
            featured: searchParams.get('featured'),
        });

        const firestore = getAdminFirestore();
        let nomineesQuery = firestore.collection('nominees');

        // Apply filters
        if (query.category) {
            nomineesQuery = nomineesQuery.where('category', '==', query.category) as any;
        }
        if (query.featured !== undefined) {
            nomineesQuery = nomineesQuery.where('featured', '==', query.featured) as any;
        }

        // Get nominees
        const snapshot = await nomineesQuery.get();
        const nominees = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Apply pagination
        const start = (query.page - 1) * query.limit;
        const end = start + query.limit;
        const paginatedNominees = nominees.slice(start, end);

        return successResponse({
            nominees: paginatedNominees,
            pagination: {
                page: query.page,
                limit: query.limit,
                total: nominees.length,
                totalPages: Math.ceil(nominees.length / query.limit),
            },
        });
    } catch (error) {
        return handleAPIError(error);
    }
}
