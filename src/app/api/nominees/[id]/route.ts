import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { apiResponse, apiError, handleApiError } from '@/lib/api-utils';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();

        const { data: n, error } = await supabase
            .from('Nominee')
            .select('*, category:Category(name), media:NomineeMedia(*)')
            .eq('id', id)
            .eq('isActive', true)
            .single();

        if (error || !n) return apiError('Nominee not found', 404);

        const transformed = {
            id: n.id,
            name: n.name,
            categoryId: n.categoryId,
            category: (n.category as any)?.name || '',
            region: n.region || 'Ethiopia',
            scope: n.scope as 'ethiopia' | 'worldwide',
            bio: n.bio || '',
            imageId: '',
            imageUrl: n.imageUrl,
            media: ((n.media as any[]) || [])
                .sort((a, b) => a.order - b.order)
                .map((m) => ({
                    type: m.type as 'image' | 'video' | 'audio',
                    url: m.url,
                    thumbnail: m.thumbnail,
                    description: m.description,
                    hint: m.hint || '',
                })),
            votes: n.voteCount,
            featured: n.featured,
        };

        return apiResponse(transformed);
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
        const { name, bio, imageUrl, categoryId, scope, featured } = body;

        const supabase = await createClient();
        const { data, error } = await supabase
            .from('Nominee')
            .update({ name, bio, imageUrl, categoryId, scope, featured })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return apiResponse({ success: true, nominee: data });
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
            .from('Nominee')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return apiResponse({ success: true });
    } catch (error) {
        return handleApiError(error);
    }
}
