import { createClient } from '@/lib/supabase/server';
import { adminAuthClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return NextResponse.json(null);

        const { data } = await adminAuthClient
            .from('User')
            .select('role')
            .eq('id', user.id)
            .single();

        return NextResponse.json({ role: data?.role || 'participant' });
    } catch {
        return NextResponse.json({ role: 'participant' });
    }
}
