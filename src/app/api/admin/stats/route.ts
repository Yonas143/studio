'''
import { NextResponse } from \'next/server\';
import { db } from \'@/lib/db\'; // Assuming you have a db instance for Prisma
import { getCurrentUser } from \'@/lib/auth-helpers\';

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== \'admin\') {
      return new NextResponse(\'Unauthorized\', { status: 401 });
    }

    const [participantCount, submissionCount, voteCount, categoryCount] = await Promise.all([
      db.user.count({ where: { role: \'participant\' } }),
      db.submission.count(),
      db.vote.count(),
      db.category.count(),
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
    console.error(\'[ADMIN_STATS_GET]\', error);
    return new NextResponse(\'Internal Server Error\', { status: 500 });
  }
}
'''