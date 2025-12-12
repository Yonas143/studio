
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiResponse, handleApiError } from '@/lib/api-utils';
import { requireAdmin } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: categories, error } = await supabase
            .from('categories')
            .select('*')
            .eq('isActive', true)
            .order('order', { ascending: true });

        if (error) {
            throw error;
        }

        return apiResponse(categories);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        await requireAdmin();
        const body = await request.json();
        const { name, description, imageUrl } = body;

        const slug = name
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');

        const supabase = await createClient();

        const { data, error } = await supabase
            .from('categories')
            .insert([{
                name,
                slug,
                description,
                imageUrl,
                isActive: true,
                order: 99
            }])
            .select();

        if (error) {
            throw error;
        }

        return apiResponse(data, 201);
    } catch (error) {
        return handleApiError(error);
    }
}
