import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        // Validate file type (MIME type)
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']; // Added video types as seen in usage
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type.' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Generate unique path
        const extension = file.name.split('.').pop()?.toLowerCase();
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const filename = `upload-${uniqueSuffix}.${extension}`;

        const { data, error } = await supabase
            .storage
            .from('uploads') // Bucket name
            .upload(filename, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        // Get Public URL
        const { data: { publicUrl } } = supabase
            .storage
            .from('uploads')
            .getPublicUrl(filename);

        return NextResponse.json({ url: publicUrl, success: true });
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: error.message || 'Error uploading file' },
            { status: 500 }
        );
    }
}
