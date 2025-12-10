import { NextRequest, NextResponse } from 'next/server';

/**
 * API Error Classes
 */
export class APIError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public code?: string
    ) {
        super(message);
        this.name = 'APIError';
    }
}

export class UnauthorizedError extends APIError {
    constructor(message = 'Unauthorized') {
        super(401, message, 'UNAUTHORIZED');
    }
}

export class ForbiddenError extends APIError {
    constructor(message = 'Forbidden') {
        super(403, message, 'FORBIDDEN');
    }
}

export class NotFoundError extends APIError {
    constructor(message = 'Not found') {
        super(404, message, 'NOT_FOUND');
    }
}

export class ValidationError extends APIError {
    constructor(message = 'Validation failed', public errors?: any) {
        super(400, message, 'VALIDATION_ERROR');
    }
}

export class RateLimitError extends APIError {
    constructor(message = 'Too many requests') {
        super(429, message, 'RATE_LIMIT_EXCEEDED');
    }
}

/**
 * Error Response Handler
 */
export function handleAPIError(error: unknown): NextResponse {
    console.error('API Error:', error);

    if (error instanceof APIError) {
        return NextResponse.json(
            {
                error: {
                    message: error.message,
                    code: error.code,
                    ...(error instanceof ValidationError && error.errors ? { errors: error.errors } : {}),
                },
            },
            { status: error.statusCode }
        );
    }

    // Handle Zod validation errors
    if (error && typeof error === 'object' && 'issues' in error) {
        return NextResponse.json(
            {
                error: {
                    message: 'Validation failed',
                    code: 'VALIDATION_ERROR',
                    errors: error.issues,
                },
            },
            { status: 400 }
        );
    }

    // Generic error
    return NextResponse.json(
        {
            error: {
                message: 'Internal server error',
                code: 'INTERNAL_ERROR',
            },
        },
        { status: 500 }
    );
}

/**
 * Success Response Helper
 */
export function successResponse<T>(data: T, status = 200): NextResponse {
    return NextResponse.json({ data }, { status });
}

/**
 * Extract and verify authorization (handled by Clerk Middleware generally)
 * These helpers are kept for backward compatibility if needed, but logic is removed.
 * Ideally, we should use requireAuth/requireAdmin from auth-helpers.
 */

