import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { adminAuthClient } from '@/lib/supabase/admin';
import { apiResponse, apiError, handleApiError } from '@/lib/api-utils';
import { verifyPayment as chapaVerify } from '@/lib/chapa';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const txRef = searchParams.get('tx_ref');

        if (!txRef) return apiError('Transaction reference is required', 400);

        const supabase = await createClient();

        const { data: payment, error: paymentError } = await supabase
            .from('Payment')
            .select('*, nominee:Nominee(name), vote:Vote(*)')
            .eq('txRef', txRef)
            .single();

        if (paymentError || !payment) return apiError('Payment not found', 404);

        if (payment.status === 'success' && payment.vote) {
            return apiResponse({
                message: 'Payment already verified',
                status: 'success',
                nomineeName: (payment.nominee as any)?.name,
                voteId: (payment.vote as any)?.id,
            });
        }

        const chapaResponse = await chapaVerify(txRef);

        if (chapaResponse.status !== 'success' || chapaResponse.data?.status !== 'success') {
            await adminAuthClient.from('Payment').update({ status: 'failed' }).eq('txRef', txRef);
            return apiError(chapaResponse.message || 'Payment verification failed', 400);
        }

        // Update payment to success
        const { data: updatedPayment, error: updateError } = await adminAuthClient
            .from('Payment')
            .update({
                status: 'success',
                chapaRef: chapaResponse.data?.reference,
                verifiedAt: new Date().toISOString(),
                email: chapaResponse.data?.email || payment.email,
                firstName: chapaResponse.data?.first_name || payment.firstName,
                lastName: chapaResponse.data?.last_name || payment.lastName,
            })
            .eq('txRef', txRef)
            .select()
            .single();

        if (updateError) throw updateError;

        // Create vote
        const { data: vote, error: voteError } = await adminAuthClient
            .from('Vote')
            .insert([{
                nomineeId: payment.nomineeId,
                paymentId: updatedPayment.id,
                ipAddress: payment.ipAddress,
                fingerprint: payment.fingerprint,
            }])
            .select()
            .single();

        if (voteError) throw voteError;

        // Increment vote count directly
        const { data: currentNominee } = await adminAuthClient
            .from('Nominee')
            .select('voteCount')
            .eq('id', payment.nomineeId)
            .single();

        await adminAuthClient
            .from('Nominee')
            .update({ voteCount: (currentNominee?.voteCount || 0) + 1 })
            .eq('id', payment.nomineeId);

        return apiResponse({
            message: 'Payment verified and vote recorded successfully',
            status: 'success',
            nomineeName: (payment.nominee as any)?.name,
            voteId: vote.id,
        });
    } catch (error) {
        return handleApiError(error);
    }
}
