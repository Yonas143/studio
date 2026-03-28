import { NextResponse } from 'next/server';
import { adminAuthClient } from '@/lib/supabase/admin';
import { isAdmin } from '@/lib/auth-helpers';

export async function GET(request: Request) {
  try {
    if (!(await isAdmin())) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { data: participants, error } = await adminAuthClient
      .from('User')
      .select('*')
      .eq('role', 'participant')
      .order('createdAt', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: participants });
  } catch (error) {
    console.error('[ADMIN_PARTICIPANTS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
