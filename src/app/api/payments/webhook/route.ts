import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPayment as chapaVerify } from '@/lib/chapa';

/**
 * POST /api/payments/webhook
 * Handle Chapa webhook notifications
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Chapa sends: { trx_ref, ref_id, status }
        const { trx_ref: txRef, status } = body;

        console.log('Webhook received:', { txRef, status });

        if (!txRef) {
            return new Response('Missing transaction reference', { status: 400 });
        }

        // Find the payment record
        const payment = await prisma.payment.findUnique({
            where: { txRef },
            include: { vote: true },
        });

        if (!payment) {
            console.error('Payment not found for webhook:', txRef);
            return new Response('Payment not found', { status: 404 });
        }

        // If already processed, skip
        if (payment.status === 'success' && payment.vote) {
            console.log('Payment already processed:', txRef);
            return new Response('Already processed', { status: 200 });
        }

        // Verify the payment with Chapa to get full details
        const chapaResponse = await chapaVerify(txRef);

        if (chapaResponse.status !== 'success' || chapaResponse.data?.status !== 'success') {
            // Update payment status to failed
            await prisma.payment.update({
                where: { txRef },
                data: { status: 'failed' },
            });
            console.log('Payment failed:', txRef);
            return new Response('Payment failed', { status: 200 });
        }

        // Process successful payment
        await prisma.$transaction(async (tx) => {
            // Update payment to success
            const updatedPayment = await tx.payment.update({
                where: { txRef },
                data: {
                    status: 'success',
                    chapaRef: chapaResponse.data?.reference,
                    verifiedAt: new Date(),
                    email: chapaResponse.data?.email || payment.email,
                    firstName: chapaResponse.data?.first_name || payment.firstName,
                    lastName: chapaResponse.data?.last_name || payment.lastName,
                },
            });

            // Create vote linked to this payment (if not exists)
            if (!payment.vote) {
                await tx.vote.create({
                    data: {
                        nomineeId: payment.nomineeId,
                        paymentId: updatedPayment.id,
                        ipAddress: payment.ipAddress,
                        fingerprint: payment.fingerprint,
                    },
                });

                // Increment nominee vote count
                await tx.nominee.update({
                    where: { id: payment.nomineeId },
                    data: {
                        voteCount: {
                            increment: 1,
                        },
                    },
                });
            }
        });

        console.log('Payment processed successfully:', txRef);
        return new Response('OK', { status: 200 });

    } catch (error) {
        console.error('Webhook error:', error);
        return new Response('Internal server error', { status: 500 });
    }
}

/**
 * GET handler for Chapa callback (redirect with query params)
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const txRef = searchParams.get('trx_ref') || searchParams.get('tx_ref');
    const status = searchParams.get('status');

    console.log('Callback received:', { txRef, status });

    // Redirect to the callback page
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
    const redirectUrl = new URL('/payment/callback', baseUrl);

    if (txRef) {
        redirectUrl.searchParams.set('tx_ref', txRef);
    }
    if (status) {
        redirectUrl.searchParams.set('status', status);
    }

    return Response.redirect(redirectUrl.toString(), 302);
}
