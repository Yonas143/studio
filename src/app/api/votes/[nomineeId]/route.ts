import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { apiResponse, handleApiError } from '@/lib/api-utils';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ nomineeId: string }> }
) {
    try {
        await requireAdmin();
        const { nomineeId } = await params;
        const supabase = await createClient();

        const { error } = await supabase
            .from('Vote')
            .delete()
            .eq('nomineeId', nomineeId);

        if (error) throw error;
        return apiResponse({ message: 'Votes removed successfully' });
    } catch (error) {
        return handleApiError(error);
    }
}

