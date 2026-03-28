import { NextRequest } from 'next/server';
import { adminAuthClient } from '@/lib/supabase/admin';
import { apiResponse, apiError, handleApiError } from '@/lib/api-utils';
import { requireAdmin } from '@/lib/auth-helpers';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();
        const { id } = await params;

        const { data: submission, error: fetchError } = await adminAuthClient
            .from('Submission')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !submission) return apiError('Submission not found', 404);
        if (submission.status === 'approved') return apiError('Submission is already approved', 400);

        // Create nominee from submission — map submission fields to Nominee
        const { data: nominee, error: nomineeError } = await adminAuthClient
            .from('Nominee')
            .insert([{
                name: submission.title,
                bio: submission.description || '',
                imageUrl: submission.fileUrl || null,
                isActive: true,
                voteCount: 0,
                scope: 'ethiopia',
                region: 'Ethiopia',
            }])
            .select()
            .single();

        if (nomineeError) throw nomineeError;

        // Update submission status
        const { error: updateError } = await adminAuthClient
            .from('Submission')
            .update({ status: 'approved' })
            .eq('id', id);

        if (updateError) throw updateError;

        return apiResponse({
            message: 'Submission approved and nominee created successfully',
            data: { nominee, submissionId: id },
        });
    } catch (error: any) {
        return handleApiError(error);
    }
}
