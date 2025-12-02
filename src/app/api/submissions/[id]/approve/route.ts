import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiResponse, apiError, handleApiError } from '@/lib/api-utils';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // Start a transaction to ensure both operations succeed or fail together
        const result = await prisma.$transaction(async (tx) => {
            // 1. Get the submission
            const submission = await tx.submission.findUnique({
                where: { id },
            });

            if (!submission) {
                throw new Error('Submission not found');
            }

            if (submission.status === 'approved') {
                throw new Error('Submission is already approved');
            }

            // 2. Create the nominee
            const nominee = await tx.nominee.create({
                data: {
                    name: submission.title,
                    category: submission.category,
                    description: submission.description || '',
                    imageUrl: submission.fileUrl,
                    videoUrl: submission.portfolioUrl, // Assuming portfolio URL might be a video
                    isActive: true,
                    voteCount: 0,
                },
            });

            // 3. Update submission status
            const updatedSubmission = await tx.submission.update({
                where: { id },
                data: { status: 'approved' },
            });

            return { nominee, submission: updatedSubmission };
        });

        return apiResponse({
            message: 'Submission approved and nominee created successfully',
            data: result,
        });
    } catch (error: any) {
        if (error.message === 'Submission not found') {
            return apiError(error.message, 404);
        }
        if (error.message === 'Submission is already approved') {
            return apiError(error.message, 400);
        }
        return handleApiError(error);
    }
}
