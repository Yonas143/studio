'use server';

/**
 * Chapa Payment Service
 * Handles all interactions with the Chapa payment gateway API
 */

const CHAPA_BASE_URL = 'https://api.chapa.co/v1';

// Types
export interface InitializePaymentParams {
    amount: number;
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    txRef: string;
    nomineeId: string;
    nomineeName: string;
    callbackUrl: string;
    returnUrl: string;
}

export interface ChapaInitializeResponse {
    status: string;
    message: string;
    data?: {
        checkout_url: string;
    };
}

export interface ChapaVerifyResponse {
    status: string;
    message: string;
    data?: {
        first_name: string;
        last_name: string;
        email: string;
        currency: string;
        amount: number;
        charge: number;
        mode: string;
        method: string;
        type: string;
        status: string;
        reference: string;
        tx_ref: string;
        created_at: string;
        updated_at: string;
    };
}

/**
 * Generate a unique transaction reference
 */
export function generateTxRef(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 10);
    return `vote-${timestamp}-${randomStr}`;
}

/**
 * Initialize a payment transaction with Chapa
 */
export async function initializePayment(
    params: InitializePaymentParams
): Promise<ChapaInitializeResponse> {
    const secretKey = process.env.CHAPA_SECRET_KEY;

    if (!secretKey) {
        throw new Error('CHAPA_SECRET_KEY is not configured');
    }

    const payload = {
        amount: params.amount.toString(),
        currency: 'ETB',
        email: params.email || 'voter@culturalambassador.com',
        first_name: params.firstName || 'Cultural',
        last_name: params.lastName || 'Ambassador',
        phone_number: params.phone,
        tx_ref: params.txRef,
        callback_url: params.callbackUrl,
        return_url: params.returnUrl,
        customization: {
            title: 'Vote for Cultural Ambassador',
            description: `Cast your vote for ${params.nomineeName}`,
        },
        meta: {
            nomineeId: params.nomineeId,
            nomineeName: params.nomineeName,
        },
    };

    try {
        const response = await fetch(`${CHAPA_BASE_URL}/transaction/initialize`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${secretKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Chapa initialization error:', data);
            return {
                status: 'failed',
                message: data.message || 'Failed to initialize payment',
            };
        }

        return data as ChapaInitializeResponse;
    } catch (error) {
        console.error('Chapa API error:', error);
        return {
            status: 'failed',
            message: 'Failed to connect to payment gateway',
        };
    }
}

/**
 * Verify a payment transaction with Chapa
 */
export async function verifyPayment(txRef: string): Promise<ChapaVerifyResponse> {
    const secretKey = process.env.CHAPA_SECRET_KEY;

    if (!secretKey) {
        throw new Error('CHAPA_SECRET_KEY is not configured');
    }

    try {
        const response = await fetch(
            `${CHAPA_BASE_URL}/transaction/verify/${txRef}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${secretKey}`,
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('Chapa verification error:', data);
            return {
                status: 'failed',
                message: data.message || 'Failed to verify payment',
            };
        }

        return data as ChapaVerifyResponse;
    } catch (error) {
        console.error('Chapa API error:', error);
        return {
            status: 'failed',
            message: 'Failed to connect to payment gateway',
        };
    }
}

/**
 * Get the vote price from environment
 */
export function getVotePrice(): number {
    const price = process.env.VOTE_PRICE;
    return price ? parseFloat(price) : 10;
}
