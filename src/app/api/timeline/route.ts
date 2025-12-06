import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiResponse, handleApiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
    try {
        const events = await prisma.timelineEvent.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                order: 'asc',
            },
        });

        // Transform if necessary to match frontend type
        const transformedEvents = events.map(event => ({
            id: event.id,
            title: event.title,
            description: event.description || '',
            date: event.date.toISOString().split('T')[0], // YYYY-MM-DD
            order: event.order,
        }));

        return NextResponse.json(transformedEvents);
    } catch (error) {
        return handleApiError(error);
    }
}
