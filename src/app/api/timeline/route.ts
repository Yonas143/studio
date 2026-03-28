import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handleApiError, apiResponse } from '@/lib/api-utils';
import { requireAdmin } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: events, error } = await supabase
            .from('TimelineEvent')
            .select('*')
            .eq('isActive', true)
            .order('order', { ascending: true });

        if (error) throw error;

        const transformed = (events || []).map((e: any) => ({
            id: e.id,
            title: e.title,
            description: e.description || '',
            date: new Date(e.date).toISOString().split('T')[0],
            order: e.order,
        }));

        return NextResponse.json(transformed);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        await requireAdmin();
        const body = await request.json();
        const { title, description, date, order } = body;

        const supabase = await createClient();
        const { data, error } = await supabase
            .from('TimelineEvent')
            .insert([{ title, description, date, order: order || 0, isActive: true }])
            .select()
            .single();

        if (error) throw error;
        return apiResponse(data, 201);
    } catch (error) {
        return handleApiError(error);
    }
}
