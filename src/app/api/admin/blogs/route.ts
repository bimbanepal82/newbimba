import { NextResponse } from 'next/server';
import { getBlogs, saveBlog, deleteBlog, BlogPost } from '@/lib/data';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  try {
    const blogs = await getBlogs(false);
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Failed to load blogs:', error);
    return NextResponse.json({ error: 'Failed to load blogs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const post: BlogPost = await req.json();
    if (!post.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!post.id) {
      post.id = 'blog-' + Date.now();
    }
    if (!post.slug) {
      post.slug = post.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
    }
    if (!post.date) {
      post.date = new Date().toISOString().split('T')[0];
    }

    const saved = await saveBlog(post);
    return NextResponse.json({ success: true, blog: saved });
  } catch (error) {
    console.error('Failed to save blog:', error);
      if (error?.code === 'SLUG_EXISTS' || error?.code === '23505') {
      return NextResponse.json(
        { error: 'Another post already uses this URL slug. Please change the slug.' },
        { status: 409,}
      );
    }
    
    return NextResponse.json({ error: 'Failed to save blog' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    const deleted = await deleteBlog(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    console.error('Failed to delete blog:', error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
