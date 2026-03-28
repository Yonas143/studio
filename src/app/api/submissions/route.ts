import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { apiResponse, apiError, handleApiError } from '@/lib/api-utils';

const submissionSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    category: z.string().min(1, 'Category is required'),
    fileUrl: z.string().url().optional().or(z.literal('')),
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    portfolioUrl: z.string().url().optional().or(z.literal('')),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = submissionSchema.parse(body);

        const supabase = await createClient();
        const { data, error } = await supabase
            .from('Submission')
            .insert([{ ...validatedData, status: 'pending' }])
            .select()
            .single();

        if (error) throw error;
        return apiResponse(data, 201);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const email = searchParams.get('email');

        const supabase = await createClient();
        let query = supabase
            .from('Submission')
            .select('*')
            .order('createdAt', { ascending: false });

        if (status) query = query.eq('status', status);
        if (email) query = query.eq('email', email);

        const { data, error } = await query;
        if (error) throw error;
        return apiResponse(data);
    } catch (error) {
        return handleApiError(error);
    }
}
