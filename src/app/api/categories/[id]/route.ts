import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiResponse, apiError, handleApiError } from '@/lib/api-utils';
import { requireAdmin } from '@/lib/auth-helpers';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();
        const { id } = await params;
        const body = await request.json();
        const { name, description, imageUrl, isActive } = body;

        const supabase = await createClient();

        const { data: existing } = await supabase
            .from('Category')
            .select('id')
            .eq('id', id)
            .single();

        if (!existing) return apiError('Category not found', 404);

        const { data, error } = await supabase
            .from('Category')
            .update({ name, description, imageUrl, isActive })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return apiResponse(data);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();
        const { id } = await params;
        const supabase = await createClient();

        const { error } = await supabase
            .from('Category')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return apiResponse({ success: true });
    } catch (error) {
        return handleApiError(error);
    }
}
