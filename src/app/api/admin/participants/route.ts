'''
import { NextResponse } from \'next/server\';
import { db } from \'@/lib/db\';
import { getCurrentUser } from \'@/lib/auth-helpers\';

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== \'admin\') {
      return new NextResponse(\'Unauthorized\', { status: 401 });
    }

    const participants = await db.user.findMany({
      where: { role: \'participant\' },
      orderBy: {
        createdAt: \'desc\',
      },
    });

    return NextResponse.json({ success: true, data: participants });
  } catch (error) {
    console.error(\'[ADMIN_PARTICIPANTS_GET]\', error);
    return new NextResponse(\'Internal Server Error\', { status: 500 });
  }
}
'''