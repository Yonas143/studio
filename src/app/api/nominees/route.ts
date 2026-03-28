import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiResponse, handleApiError } from '@/lib/api-utils';
import { requireAdmin } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        const scope = searchParams.get('scope');
        const featured = searchParams.get('featured');

        const supabase = await createClient();

        let query = supabase
            .from('Nominee')
            .select('*, category:Category(name), media:NomineeMedia(*)')
            .eq('isActive', true)
            .order('voteCount', { ascending: false });

        if (categoryId) query = query.eq('categoryId', categoryId);
        if (scope && scope !== 'all') query = query.eq('scope', scope);
        if (featured === 'true') query = query.eq('featured', true);

        const { data: nominees, error } = await query;
        if (error) throw error;

        const transformed = (nominees || []).map((n: any) => ({
            id: n.id,
            name: n.name,
            categoryId: n.categoryId,
            category: n.category?.name || '',
            region: n.region || 'Ethiopia',
            scope: n.scope as 'ethiopia' | 'worldwide',
            bio: n.bio || '',
            imageId: '',
            imageUrl: n.imageUrl,
            media: (n.media || [])
                .sort((a: any, b: any) => a.order - b.order)
                .map((m: any) => ({
                    type: m.type as 'image' | 'video' | 'audio',
                    url: m.url,
                    thumbnail: m.thumbnail,
                    description: m.description,
                    hint: m.hint || '',
                })),
            votes: n.voteCount,
            featured: n.featured,
        }));

        return apiResponse(transformed);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        await requireAdmin();
        const body = await request.json();
        const { name, bio, imageUrl, categoryId, scope, media } = body;

        const supabase = await createClient();

        const { data: nominee, error } = await supabase
            .from('Nominee')
            .insert([{ name, bio, imageUrl, categoryId, scope: scope || 'ethiopia' }])
            .select()
            .single();

        if (error) throw error;

        if (media && media.length > 0) {
            const mediaRows = media.map((m: any, index: number) => ({
                nomineeId: nominee.id,
                type: m.type,
                url: m.url,
                thumbnail: m.thumbnail,
                description: m.description,
                hint: m.hint || null,
                order: index,
            }));
            await supabase.from('NomineeMedia').insert(mediaRows);
        }

        return apiResponse(nominee, 201);
    } catch (error) {
        return handleApiError(error);
    }
}
