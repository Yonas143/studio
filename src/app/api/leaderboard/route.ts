import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiResponse, handleApiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        const limit = parseInt(searchParams.get('limit') || '10');

        const supabase = await createClient();

        let query = supabase
            .from('Nominee')
            .select('id, name, voteCount, category:Category(name)')
            .eq('isActive', true)
            .order('voteCount', { ascending: false })
            .limit(limit);

        if (categoryId) query = query.eq('categoryId', categoryId);

        const { data: nominees, error } = await query;
        if (error) throw error;

        const leaders = (nominees || []).map((n: any) => ({
            nomineeId: n.id,
            nomineeName: n.name,
            category: n.category?.name || '',
            voteCount: n.voteCount,
        }));

        return apiResponse(leaders);
    } catch (error) {
        return handleApiError(error);
    }
}
