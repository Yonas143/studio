import { NextRequest } from 'next/server';
import { adminAuthClient } from '@/lib/supabase/admin';
import { verifyPayment as chapaVerify } from '@/lib/chapa';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { trx_ref: txRef, status } = body;

        console.log('Webhook received:', { txRef, status });
        if (!txRef) return new Response('Missing transaction reference', { status: 400 });

        const { data: payment } = await adminAuthClient
            .from('Payment')
            .select('*, vote:Vote(*)')
            .eq('txRef', txRef)
            .single();

        if (!payment) {
            console.error('Payment not found for webhook:', txRef);
            return new Response('Payment not found', { status: 404 });
        }

        if (payment.status === 'success' && payment.vote) {
            return new Response('Already processed', { status: 200 });
        }

        const chapaResponse = await chapaVerify(txRef);

        if (chapaResponse.status !== 'success' || chapaResponse.data?.status !== 'success') {
            await adminAuthClient.from('Payment').update({ status: 'failed' }).eq('txRef', txRef);
            return new Response('Payment failed', { status: 200 });
        }

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

        if (!payment.vote) {
            await adminAuthClient.from('Vote').insert([{
                nomineeId: payment.nomineeId,
                paymentId: updatedPayment.id,
                ipAddress: payment.ipAddress,
                fingerprint: payment.fingerprint,
            }]);

            await adminAuthClient.rpc('increment_vote_count', { nominee_id: payment.nomineeId });
        }

        console.log('Payment processed successfully:', txRef);
        return new Response('OK', { status: 200 });
    } catch (error) {
        console.error('Webhook error:', error);
        return new Response('Internal server error', { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const txRef = searchParams.get('trx_ref') || searchParams.get('tx_ref');
    const status = searchParams.get('status');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
    const redirectUrl = new URL('/payment/callback', baseUrl);
    if (txRef) redirectUrl.searchParams.set('tx_ref', txRef);
    if (status) redirectUrl.searchParams.set('status', status);

    return Response.redirect(redirectUrl.toString(), 302);
}
