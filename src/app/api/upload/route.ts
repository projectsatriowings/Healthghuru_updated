/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';
import { sql } from '@/lib/db';
import { inferMimeType } from '@/lib/media';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes);
    const mimeType = file.type || inferMimeType(file.name);

    // Optimize image if it is an image (except SVG)
    if (mimeType.startsWith('image/') && !file.name.toLowerCase().endsWith('.svg')) {
      try {
        const sharpInstance = sharp(buffer).rotate();
        const metadata = await sharpInstance.metadata();
        if (metadata.width && metadata.width > 2000) {
          buffer = await sharpInstance
            .resize({ width: 2000, withoutEnlargement: true })
            .toBuffer();
        }
      } catch (sharpErr) {
        console.warn('Sharp optimization skipped:', sharpErr);
      }
    }

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitizedOriginal = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${uniqueSuffix}-${sanitizedOriginal}`;

    // 1. Save to Neon PostgreSQL database (guarantees survival on live serverless / Vercel)
    const base64 = buffer.toString('base64');
    try {
      await sql`
        INSERT INTO uploaded_files (filename, mime_type, file_size, data_base64)
        VALUES (${filename}, ${mimeType}, ${buffer.length}, ${base64})
        ON CONFLICT (filename) DO UPDATE SET
          mime_type = EXCLUDED.mime_type,
          file_size = EXCLUDED.file_size,
          data_base64 = EXCLUDED.data_base64
      `;
    } catch (dbErr: any) {
      // Auto-create table if needed
      if (dbErr.message && dbErr.message.includes('relation "uploaded_files" does not exist')) {
        await sql`
          CREATE TABLE IF NOT EXISTS uploaded_files (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            filename VARCHAR(255) NOT NULL UNIQUE,
            mime_type VARCHAR(100) NOT NULL,
            file_size BIGINT NOT NULL,
            data_base64 TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_uploaded_files_filename ON uploaded_files(filename);
        `;
        await sql`
          INSERT INTO uploaded_files (filename, mime_type, file_size, data_base64)
          VALUES (${filename}, ${mimeType}, ${buffer.length}, ${base64})
          ON CONFLICT (filename) DO UPDATE SET
            mime_type = EXCLUDED.mime_type,
            file_size = EXCLUDED.file_size,
            data_base64 = EXCLUDED.data_base64
        `;
      } else {
        throw dbErr;
      }
    }

    // 2. Best-effort cache on local disk (works in local dev, safely ignored on live serverless read-only filesystem)
    try {
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      await writeFile(join(uploadDir, filename), buffer);
    } catch {
      // EROFS / read-only filesystem on live — safely ignored as file is persisted in database
    }

    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
