import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
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

/**
 * POST /api/payments/initialize
 * Initialize a Chapa payment for voting
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { nomineeId, email, firstName, lastName, phone, fingerprint } = initializeSchema.parse(body);

        // Get IP address
        const headersList = await headers();
        const forwardedFor = headersList.get('x-forwarded-for');
        const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

        // Check if nominee exists and is active
        const nominee = await prisma.nominee.findUnique({
            where: { id: nomineeId },
        });

        if (!nominee) {
            return apiError('Nominee not found', 404);
        }

        if (!nominee.isActive) {
            return apiError('Voting is closed for this nominee', 400);
        }

        // Generate unique transaction reference
        const txRef = generateTxRef();
        const votePrice = getVotePrice();

        // Get base URL for callbacks
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
        const callbackUrl = `${baseUrl}/api/payments/webhook`;
        const returnUrl = `${baseUrl}/payment/callback?tx_ref=${txRef}`;

        // Initialize payment with Chapa
        const chapaResponse = await initializePayment({
            amount: votePrice,
            email,
            firstName,
            lastName,
            phone,
            txRef,
            nomineeId,
            nomineeName: nominee.name,
            callbackUrl,
            returnUrl,
        });

        if (chapaResponse.status !== 'success' || !chapaResponse.data?.checkout_url) {
            console.error('Chapa initialization failed:', chapaResponse);
            return apiError(chapaResponse.message || 'Failed to initialize payment', 500);
        }

        // Create pending payment record in database
        const payment = await prisma.payment.create({
            data: {
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
            },
        });

        return apiResponse({
            message: 'Payment initialized successfully',
            checkoutUrl: chapaResponse.data.checkout_url,
            txRef: payment.txRef,
        }, 201);

    } catch (error) {
        return handleApiError(error);
    }
}
