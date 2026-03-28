import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { apiResponse, handleApiError, getPagination, paginatedResponse } from '@/lib/api-utils';
import { requireAdmin } from '@/lib/auth-helpers';

const popupSchema = z.object({
    type: z.enum(['video', 'image', 'text']),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    videoUrl: z.string().url().optional().or(z.literal('')),
    imageUrl: z.string().url().optional().or(z.literal('')),
    imageLink: z.string().url().optional().or(z.literal('')),
    isActive: z.boolean().default(true),
    delaySeconds: z.number().int().min(0).default(2),
    storageKey: z.string().min(1, 'Storage key is required'),
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const { skip, take, page, limit } = getPagination(searchParams);
        const isActive = searchParams.get('isActive');

        const supabase = await createClient();

        let query = supabase
            .from('Popup')
            .select('*', { count: 'exact' })
            .order('createdAt', { ascending: false })
            .range(skip, skip + take - 1);

        if (isActive !== null) query = query.eq('isActive', isActive === 'true');

        const { data: popups, count, error } = await query;
        if (error) throw error;

        let finalPopups = popups || [];
        let total = count || 0;

        // Create default popup if none active
        if (isActive === 'true' && finalPopups.length === 0) {
            const { data: created } = await supabase
                .from('Popup')
                .insert([{
                    type: 'video',
                    title: 'Welcome to Cultural Ambassador Award',
                    description: 'Discover the talent.',
                    videoUrl: '/files/All%20Talent%20Final%20%20(2)hand.mp4',
                    isActive: true,
                    delaySeconds: 1,
                    storageKey: 'default-welcome-popup',
                }])
                .select()
                .single();
            if (created) { finalPopups = [created]; total = 1; }
        }

        return apiResponse(paginatedResponse(finalPopups, total, page, limit));
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        await requireAdmin();
        const body = await request.json();
        const validatedData = popupSchema.parse(body);

        const supabase = await createClient();
        const { data, error } = await supabase
            .from('Popup')
            .insert([{
                type: validatedData.type,
                title: validatedData.title,
                description: validatedData.description || null,
                videoUrl: validatedData.videoUrl || null,
                imageUrl: validatedData.imageUrl || null,
                imageLink: validatedData.imageLink || null,
                isActive: validatedData.isActive,
                delaySeconds: validatedData.delaySeconds,
                storageKey: validatedData.storageKey,
            }])
            .select()
            .single();

        if (error) throw error;
        return apiResponse(data, 201);
    } catch (error) {
        return handleApiError(error);
    }
}

