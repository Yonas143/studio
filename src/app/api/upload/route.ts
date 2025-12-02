import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

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

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.' },
                { status: 400 }
            );
        }

        // Validate file size (e.g., 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 5MB.' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure directory exists
        const uploadDir = join(process.cwd(), 'public/files');

        if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true });
        }

        // Create unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const extension = file.name.split('.').pop();
        const filename = `upload-${uniqueSuffix}.${extension}`;
        const filepath = join(uploadDir, filename);

        // Write file
        await writeFile(filepath, buffer);

        // Return public URL
        const url = `/files/${filename}`;

        return NextResponse.json({ url, success: true });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Error uploading file' },
            { status: 500 }
        );
    }
}
