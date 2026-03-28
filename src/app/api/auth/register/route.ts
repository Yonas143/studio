import { NextRequest } from 'next/server';
import { adminAuthClient } from '@/lib/supabase/admin';
import { apiResponse, apiError, handleApiError } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
    try {
        const { id, email, name } = await request.json();

        if (!id || !email) return apiError('Missing user data', 400);

        const { error } = await adminAuthClient
            .from('User')
            .upsert([{ id, email, name: name || email.split('@')[0], role: 'participant' }]);

        if (error) throw error;

        return apiResponse({ success: true });
    } catch (error) {
        return handleApiError(error);
    }
}
