import { NextResponse } from 'next/server';
import { getMediaFiles } from '@/lib/data';
import { isAuthenticated } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const media = getMediaFiles();
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

    // Only allow deleting inside uploads folder to prevent deleting core branding SVGs
    if (fileName.startsWith('assets/')) {
      return NextResponse.json({ error: 'Cannot delete core system assets' }, { status: 403 });
    }

    const cleanName = path.basename(fileName);
    const filePath = path.join(process.cwd(), 'public', 'uploads', cleanName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ success: true, message: 'File deleted' });
    }

    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
