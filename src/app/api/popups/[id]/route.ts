import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { apiResponse, apiError, handleApiError } from '@/lib/api-utils';
import { requireAdmin } from '@/lib/auth-helpers';

const popupUpdateSchema = z.object({
    type: z.enum(['video', 'image', 'text']).optional(),
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    videoUrl: z.string().url().optional().or(z.literal('')),
    imageUrl: z.string().url().optional().or(z.literal('')),
    imageLink: z.string().url().optional().or(z.literal('')),
    isActive: z.boolean().optional(),
    delaySeconds: z.number().int().min(0).optional(),
    storageKey: z.string().min(1).optional(),
});

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data, error } = await supabase.from('Popup').select('*').eq('id', id).single();
        if (error || !data) return apiError('Popup not found', 404);
        return apiResponse(data);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();
        const { id } = await params;
        const body = await request.json();
        const validatedData = popupUpdateSchema.parse(body);

        const supabase = await createClient();
        const { data, error } = await supabase
            .from('Popup')
            .update(validatedData)
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
        const { error } = await supabase.from('Popup').delete().eq('id', id);
        if (error) throw error;
        return apiResponse({ message: 'Popup deleted successfully' });
    } catch (error) {
        return handleApiError(error);
    }
}
