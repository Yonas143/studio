import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        let config = await prisma.adConfig.findUnique({
            where: { id: 'default' },
        });

        if (!config) {
            // Create default config if it doesn't exist
            config = await prisma.adConfig.create({
                data: {
                    id: 'default',
                    leftAdImage: 'https://placehold.co/160x600/2563eb/ffffff.png?text=Left+Ad',
                    leftAdLink: '#',
                    leftAdActive: true,
                    rightAdImage: 'https://placehold.co/160x600/db2777/ffffff.png?text=Right+Ad',
                    rightAdLink: '#',
                    rightAdActive: true,
                },
            });
        }

        // Transform to frontend format
        const responseData = {
            leftAd: {
                imageUrl: config.leftAdImage,
                linkUrl: config.leftAdLink,
                active: config.leftAdActive,
            },
            rightAd: {
                imageUrl: config.rightAdImage,
                linkUrl: config.rightAdLink,
                active: config.rightAdActive,
            },
        };

        return NextResponse.json(responseData);
    } catch (error) {
        console.error('Error fetching ads:', error);
        return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { leftAd, rightAd } = body;

        const config = await prisma.adConfig.upsert({
            where: { id: 'default' },
            update: {
                leftAdImage: leftAd.imageUrl,
                leftAdLink: leftAd.linkUrl,
                leftAdActive: leftAd.active,
                rightAdImage: rightAd.imageUrl,
                rightAdLink: rightAd.linkUrl,
                rightAdActive: rightAd.active,
            },
            create: {
                id: 'default',
                leftAdImage: leftAd.imageUrl,
                leftAdLink: leftAd.linkUrl,
                leftAdActive: leftAd.active,
                rightAdImage: rightAd.imageUrl,
                rightAdLink: rightAd.linkUrl,
                rightAdActive: rightAd.active,
            },
        });

        return NextResponse.json({ success: true, config });
    } catch (error) {
        console.error('Error saving ads:', error);
        return NextResponse.json({ error: 'Failed to save ads' }, { status: 500 });
    }
}
