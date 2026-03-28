import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { apiResponse, handleApiError } from '@/lib/api-utils';
import { updateSubmissionSchema } from '@/lib/api/validation';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();
        const { id } = await params;
        const body = await request.json();
        const validatedData = updateSubmissionSchema.parse(body);

        const supabase = await createClient();
        const { error } = await supabase
            .from('Submission')
            .update(validatedData)
            .eq('id', id);

        if (error) throw error;
        return apiResponse({ message: 'Submission updated successfully' });
    } catch (error) {
        return handleApiError(error);
    }
}

