import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const DEFAULT_AD = {
    id: 'default',
    leftAdImage: 'https://abyssiniabusinessnetwork.com/wp-content/uploads/2021/12/10gif-1.gif',
    leftAdLink: '#',
    leftAdActive: true,
    rightAdImage: 'https://abyssiniabusinessnetwork.com/wp-content/uploads/2021/12/10gif-1.gif',
    rightAdLink: '#',
    rightAdActive: true,
};

function toResponse(config: any) {
    return {
        leftAd: { imageUrl: config.leftAdImage, linkUrl: config.leftAdLink, active: config.leftAdActive },
        rightAd: { imageUrl: config.rightAdImage, linkUrl: config.rightAdLink, active: config.rightAdActive },
    };
}

export async function GET() {
    try {
        const supabase = await createClient();
        let { data: config } = await supabase
            .from('AdConfig')
            .select('*')
            .eq('id', 'default')
            .single();

        if (!config) {
            const { data: created } = await supabase
                .from('AdConfig')
                .insert([DEFAULT_AD])
                .select()
                .single();
            config = created || DEFAULT_AD;
        }

        return NextResponse.json(toResponse(config));
    } catch (error) {
        console.error('Error fetching ads:', error);
        return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { leftAd, rightAd } = body;

        const supabase = await createClient();
        const { data: config, error } = await supabase
            .from('AdConfig')
            .upsert({
                id: 'default',
                leftAdImage: leftAd.imageUrl,
                leftAdLink: leftAd.linkUrl,
                leftAdActive: leftAd.active,
                rightAdImage: rightAd.imageUrl,
                rightAdLink: rightAd.linkUrl,
                rightAdActive: rightAd.active,
            })
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ success: true, config });
    } catch (error) {
        console.error('Error saving ads:', error);
        return NextResponse.json({ error: 'Failed to save ads' }, { status: 500 });
    }
}
