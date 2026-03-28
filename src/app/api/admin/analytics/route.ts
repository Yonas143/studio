import { NextRequest } from 'next/server';
import { adminAuthClient } from '@/lib/supabase/admin';
import { apiResponse, handleApiError } from '@/lib/api-utils';
import { requireAdmin } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
    try {
        await requireAdmin();

        const [
            { data: nominees },
            { data: votes },
            { data: categories },
        ] = await Promise.all([
            adminAuthClient.from('Nominee').select('*, category:Category(name)'),
            adminAuthClient.from('Vote').select('*').order('createdAt', { ascending: true }),
            adminAuthClient.from('Category').select('*'),
        ]);

        return apiResponse({ nominees, votes, categories });
    } catch (error) {
        return handleApiError(error);
    }
}
