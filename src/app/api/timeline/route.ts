import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handleApiError } from '@/lib/api-utils';

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
