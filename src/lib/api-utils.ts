import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Standard API response wrapper
 */
export function apiResponse<T>(data: T, status: number = 200) {
    return NextResponse.json({ success: true, data }, { status });
}

/**
 * Standard API error response
 */
export function apiError(message: string, status: number = 400, errors?: any) {
    return NextResponse.json(
        {
            success: false,
            error: message,
            ...(errors && { errors }),
        },
        { status }
    );
}

/**
 * Handle Prisma and validation errors
 */
export function handleApiError(error: unknown) {
    console.error('API Error:', error);

    if (error instanceof ZodError) {
        return apiError('Validation failed', 400, error.errors);
    }

    if (error instanceof Error) {
        // Prisma errors
        if (error.message.includes('Unique constraint')) {
            return apiError('Resource already exists', 409);
        }
        if (error.message.includes('Foreign key constraint')) {
            return apiError('Related resource not found', 404);
        }
        if (error.message.includes('Record to update not found')) {
            return apiError('Resource not found', 404);
        }

        return apiError(error.message, 500);
    }

    return apiError('An unexpected error occurred', 500);
}

/**
 * Pagination helper
 */
export function getPagination(searchParams: URLSearchParams) {
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    return { page, limit, skip, take: limit };
}

/**
 * Build pagination response
 */
export function paginatedResponse<T>(
    data: T[],
    total: number,
    page: number,
    limit: number
) {
    return {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasMore: page * limit < total,
        },
    };
}
