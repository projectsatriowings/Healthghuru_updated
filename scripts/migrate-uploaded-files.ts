import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

const sql = neon(process.env.DATABASE_URL);

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
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };
  return map[ext] || 'application/octet-stream';
}

async function migrate() {
  console.log('🚀 Setting up uploaded_files table in Neon PostgreSQL...');

  await sql`
    CREATE TABLE IF NOT EXISTS uploaded_files (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      filename VARCHAR(255) NOT NULL UNIQUE,
      mime_type VARCHAR(100) NOT NULL,
      file_size BIGINT NOT NULL,
      data_base64 TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_uploaded_files_filename ON uploaded_files(filename);
  `;

  console.log('✅ uploaded_files table ready.');

  // Sync existing local files in public/uploads into uploaded_files table
  const uploadsDir = join(process.cwd(), 'public', 'uploads');
  try {
    const entries = await readdir(uploadsDir, { withFileTypes: true });
    let count = 0;
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const filename = entry.name;
      const filePath = join(uploadsDir, filename);

      const buffer = await readFile(filePath);
      // Skip very large files (like > 20MB video) in initial sync to keep DB fast
      if (buffer.length > 20 * 1024 * 1024) {
        console.log(`⏩ Skipping ${filename} (>20MB)`);
        continue;
      }

      const mimeType = inferMimeType(filename);
      const base64 = buffer.toString('base64');

      await sql`
        INSERT INTO uploaded_files (filename, mime_type, file_size, data_base64)
        VALUES (${filename}, ${mimeType}, ${buffer.length}, ${base64})
        ON CONFLICT (filename) DO UPDATE SET
          mime_type = EXCLUDED.mime_type,
          file_size = EXCLUDED.file_size,
          data_base64 = EXCLUDED.data_base64
      `;
      count++;
      console.log(`✓ Synced ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
    }
    console.log(`🎉 Successfully synced ${count} local files to Neon database!`);
  } catch (err: any) {
    console.warn('Notice when reading public/uploads:', err.message);
  }
}

migrate()
  .then(() => {
    console.log('Migration finished successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
