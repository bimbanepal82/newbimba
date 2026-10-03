import { NextResponse } from 'next/server';
import { getMediaFiles } from '@/lib/data';
import { isAuthenticated } from '@/lib/auth';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const media = await getMediaFiles();
  return NextResponse.json(media);
}

export async function DELETE(req: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('name');
    if (!fileName) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    if (fileName.startsWith('assets/')) {
      return NextResponse.json({ error: 'Cannot delete core system assets' }, { status: 403 });
    }

    // 1. Delete from Supabase Storage & media table if configured
    if (isSupabaseConfigured() && supabaseAdmin) {
      try {
        await supabaseAdmin.storage.from('media').remove([fileName]);
        await supabaseAdmin.from('media').delete().eq('name', fileName);
      } catch (err) {
        console.warn('Supabase delete media warning:', err);
      }
    }

    // 2. Local disk delete
    const cleanName = path.basename(fileName);
    const filePath = path.join(process.cwd(), 'public', 'uploads', cleanName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ success: true, message: 'File deleted' });
    }

    return NextResponse.json({ success: true, message: 'Delete processed' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
