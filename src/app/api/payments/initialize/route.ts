import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { adminAuthClient } from '@/lib/supabase/admin';
import { apiResponse, apiError, handleApiError } from '@/lib/api-utils';
import { headers } from 'next/headers';
import { generateTxRef, initializePayment, getVotePrice } from '@/lib/chapa';

const initializeSchema = z.object({
    nomineeId: z.string().min(1, 'Nominee ID is required'),
    email: z.string().email().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    fingerprint: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { nomineeId, email, firstName, lastName, phone, fingerprint } = initializeSchema.parse(body);

        const headersList = await headers();
        const forwardedFor = headersList.get('x-forwarded-for');
        const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

        const supabase = await createClient();

        const { data: nominee, error: nomineeError } = await supabase
            .from('Nominee')
            .select('id, name, isActive')
            .eq('id', nomineeId)
            .single();

        if (nomineeError || !nominee) return apiError('Nominee not found', 404);
        if (!nominee.isActive) return apiError('Voting is closed for this nominee', 400);

        const txRef = generateTxRef();
        const votePrice = getVotePrice();
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';

        const chapaResponse = await initializePayment({
            amount: votePrice,
            email,
            firstName,
            lastName,
            phone,
            txRef,
            nomineeId,
            nomineeName: nominee.name,
            callbackUrl: `${baseUrl}/api/payments/webhook`,
            returnUrl: `${baseUrl}/payment/callback?tx_ref=${txRef}`,
        });

        if (chapaResponse.status !== 'success' || !chapaResponse.data?.checkout_url) {
            return apiError(chapaResponse.message || 'Failed to initialize payment', 500);
        }

        const { data: payment, error: paymentError } = await adminAuthClient
            .from('Payment')
            .insert([{
                txRef,
                nomineeId,
                amount: votePrice,
                currency: 'ETB',
                status: 'pending',
                email: email || null,
                firstName: firstName || null,
                lastName: lastName || null,
                phone: phone || null,
                fingerprint: fingerprint || null,
                ipAddress: ip,
                checkoutUrl: chapaResponse.data.checkout_url,
            }])
            .select()
            .single();

        if (paymentError) throw paymentError;

        return apiResponse({
            message: 'Payment initialized successfully',
            checkoutUrl: chapaResponse.data.checkout_url,
            txRef: payment.txRef,
        }, 201);
    } catch (error) {
        return handleApiError(error);
    }
}
