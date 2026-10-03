import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const targetFolder = formData.get('folder') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name).toLowerCase();
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${Date.now()}_${baseName}${ext}`;

    // 1. Supabase Storage Upload (if configured)
    if (isSupabaseConfigured() && supabaseAdmin) {
      try {
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('media')
          .upload(fileName, buffer, {
            contentType: file.type || 'application/octet-stream',
            upsert: true,
          });

        if (!uploadError && uploadData) {
          const { data: urlData } = supabaseAdmin.storage.from('media').getPublicUrl(fileName);
          const publicUrl = urlData.publicUrl;

          // Record in media table
          await supabaseAdmin.from('media').insert({
            name: file.name,
            url: publicUrl,
            file_path: uploadData.path,
            file_type: file.type,
            size: buffer.length,
            bucket: 'media',
          });

          return NextResponse.json({
            success: true,
            url: publicUrl,
            fileName,
            size: buffer.length,
            storage: 'supabase',
          });
        } else {
          console.warn('Supabase storage upload error, falling back to local disk:', uploadError);
        }
      } catch (err) {
        console.warn('Supabase upload exception:', err);
      }
    }

    // 2. Local disk fallback
    const destDir =
      targetFolder === 'assets'
        ? path.join(process.cwd(), 'public', 'assets')
        : path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const destPath = path.join(destDir, fileName);
    fs.writeFileSync(destPath, buffer);

    const publicUrl = targetFolder === 'assets' ? `/assets/${fileName}` : `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      size: buffer.length,
      storage: 'local',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
