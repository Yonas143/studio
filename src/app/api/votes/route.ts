import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { apiResponse, apiError, handleApiError } from '@/lib/api-utils';
import { headers } from 'next/headers';

const voteSchema = z.object({
    nomineeId: z.string().min(1, 'Nominee ID is required'),
    fingerprint: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { nomineeId, fingerprint } = voteSchema.parse(body);

        // Get IP address
        const headersList = headers();
        const forwardedFor = headersList.get('x-forwarded-for');
        const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

        // Check if nominee exists
        const nominee = await prisma.nominee.findUnique({
            where: { id: nomineeId },
        });

        if (!nominee) {
            return apiError('Nominee not found', 404);
        }

        if (!nominee.isActive) {
            return apiError('Voting is closed for this nominee', 400);
        }

        // Rate Limiting: Check if IP has voted for this nominee today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const existingVote = await prisma.vote.findFirst({
            where: {
                nomineeId,
                ipAddress: ip,
                createdAt: {
                    gte: startOfDay,
                },
            },
        });

        if (existingVote) {
            return apiError('You have already voted for this nominee today', 429);
        }

        // Create vote
        const vote = await prisma.vote.create({
            data: {
                nomineeId,
                ipAddress: ip,
                fingerprint,
            },
        });

        // Increment nominee vote count
        await prisma.nominee.update({
            where: { id: nomineeId },
            data: {
                voteCount: {
                    increment: 1,
                },
            },
        });

        return apiResponse({ message: 'Vote recorded successfully', vote }, 201);
    } catch (error) {
        return handleApiError(error);
    }
}
