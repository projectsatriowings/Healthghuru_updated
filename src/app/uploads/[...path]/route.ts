import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const dynamic = 'force-dynamic';

function inferMimeType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop() || '';
  const map: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    avif: 'image/avif',
    mp4: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    txt: 'text/plain',
    csv: 'text/csv',
    json: 'application/json',
  };
  return map[ext] || 'application/octet-stream';
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const rawSegments = params?.path || [];
    const filename = Array.isArray(rawSegments) ? rawSegments.join('/') : String(rawSegments);

    if (!filename || filename === 'undefined') {
      return new NextResponse('File not found', { status: 404 });
    }

    // 1. Check if file is available locally on filesystem
    try {
      const localPath = join(process.cwd(), 'public', 'uploads', filename);
      const buffer = await readFile(localPath);
      const mimeType = inferMimeType(filename);

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Content-Length': buffer.length.toString(),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } catch {
      // File not found on local disk (expected in production serverless / Vercel), fall back to DB
    }

    // 2. Fetch from Neon PostgreSQL database
    const rows = await sql`
      SELECT mime_type, file_size, data_base64
      FROM uploaded_files
      WHERE filename = ${filename}
      LIMIT 1
    `;

    if (rows && rows.length > 0 && rows[0].data_base64) {
      const buffer = Buffer.from(rows[0].data_base64, 'base64');
      const mimeType = rows[0].mime_type || inferMimeType(filename);

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Content-Length': buffer.length.toString(),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    return new NextResponse('File not found', { status: 404 });
  } catch (error: any) {
    console.error('Error serving uploaded file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
