import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { apiResponse, apiError, handleApiError } from '@/lib/api-utils';

const submissionSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    category: z.string().min(1, 'Category is required'),
    fileUrl: z.string().url().optional().or(z.literal('')),
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    portfolioUrl: z.string().url().optional().or(z.literal('')),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = submissionSchema.parse(body);

        const submission = await prisma.submission.create({
            data: {
                title: validatedData.title,
                description: validatedData.description,
                category: validatedData.category,
                fileUrl: validatedData.fileUrl,
                fullName: validatedData.fullName,
                email: validatedData.email,
                phone: validatedData.phone,
                portfolioUrl: validatedData.portfolioUrl,
                status: 'pending',
            },
        });

        return apiResponse(submission, 201);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const email = searchParams.get('email');

        const where: any = {};
        if (status) where.status = status;
        if (email) where.email = email;

        const submissions = await prisma.submission.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
        });

        return apiResponse(submissions);
    } catch (error) {
        return handleApiError(error);
    }
}
