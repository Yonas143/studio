
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth-helpers';

export async function GET(request: Request) {
  try {
    const isUserAdmin = await isAdmin();

    if (!isUserAdmin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const participants = await prisma.user.findMany({
      where: { role: 'participant' },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, data: participants });
  } catch (error) {
    console.error('[ADMIN_PARTICIPANTS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}