import { NextResponse } from 'next/server';
import { adminAuthClient } from '@/lib/supabase/admin';
import { isAdmin } from '@/lib/auth-helpers';

export async function GET(request: Request) {
  try {
    if (!(await isAdmin())) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const [
      { count: participants },
      { count: submissions },
      { count: votes },
      { count: categories },
    ] = await Promise.all([
      adminAuthClient.from('User').select('*', { count: 'exact', head: true }).eq('role', 'participant'),
      adminAuthClient.from('Submission').select('*', { count: 'exact', head: true }),
      adminAuthClient.from('Vote').select('*', { count: 'exact', head: true }),
      adminAuthClient.from('Category').select('*', { count: 'exact', head: true }),
    ]);

    return NextResponse.json({
      success: true,
      data: { participants, submissions, votes, categories },
    });
  } catch (error) {
    console.error('[ADMIN_STATS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
