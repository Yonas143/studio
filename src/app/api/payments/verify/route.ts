import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiResponse, apiError, handleApiError } from '@/lib/api-utils';
import { verifyPayment as chapaVerify } from '@/lib/chapa';

/**
 * GET /api/payments/verify?tx_ref=xxx
 * Verify a Chapa payment and record the vote
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const txRef = searchParams.get('tx_ref');

        if (!txRef) {
            return apiError('Transaction reference is required', 400);
        }

        // Find the payment record
        const payment = await prisma.payment.findUnique({
            where: { txRef },
            include: { vote: true, nominee: true },
        });

        if (!payment) {
            return apiError('Payment not found', 404);
        }

        // If already verified and vote exists, return success
        if (payment.status === 'success' && payment.vote) {
            return apiResponse({
                message: 'Payment already verified',
                status: 'success',
                nomineeName: payment.nominee.name,
                voteId: payment.vote.id,
            });
        }

        // Verify payment with Chapa
        const chapaResponse = await chapaVerify(txRef);

        if (chapaResponse.status !== 'success' || chapaResponse.data?.status !== 'success') {
            // Update payment status to failed
            await prisma.payment.update({
                where: { txRef },
                data: { status: 'failed' },
            });

            return apiError(
                chapaResponse.message || 'Payment verification failed',
                400
            );
        }

        // Use a transaction to update payment and create vote atomically
        const result = await prisma.$transaction(async (tx) => {
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

            // Create vote linked to this payment
            const vote = await tx.vote.create({
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

            return { payment: updatedPayment, vote };
        });

        return apiResponse({
            message: 'Payment verified and vote recorded successfully',
            status: 'success',
            nomineeName: payment.nominee.name,
            voteId: result.vote.id,
        });

    } catch (error) {
        return handleApiError(error);
    }
}
