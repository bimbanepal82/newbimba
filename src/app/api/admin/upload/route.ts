import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
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
    const targetFolder = formData.get('folder') as string | null; // e.g. "assets" or "uploads"

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Sanitize filename
    const ext = path.extname(file.name).toLowerCase();
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${Date.now()}_${baseName}${ext}`;

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
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
