
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth-helpers';

export async function GET(request: Request) {
  try {
    const isUserAdmin = await isAdmin();

    if (!isUserAdmin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const [participantCount, submissionCount, voteCount, categoryCount] = await Promise.all([
      prisma.user.count({ where: { role: 'participant' } }),
      prisma.submission.count(),
      prisma.vote.count(),
      prisma.category.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        participants: participantCount,
        submissions: submissionCount,
        votes: voteCount,
        categories: categoryCount,
      },
    });
  } catch (error) {
    console.error('[ADMIN_STATS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}