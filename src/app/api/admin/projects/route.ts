import { NextResponse } from 'next/server';
import { getProjects, saveProject, deleteProject, ProjectItem } from '@/lib/data';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  const projects = getProjects(false);
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const project: ProjectItem = await req.json();
    if (!project.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!project.id) {
      project.id = 'project-' + Date.now();
    }
    if (!project.slug) {
      project.slug = project.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
    }
    if (!project.stats) {
      project.stats = [];
    }
    if (!project.photos) {
      project.photos = [];
    }

    const saved = saveProject(project);
    return NextResponse.json({ success: true, project: saved });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save project' }, { status: 500 });
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
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const deleted = deleteProject(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
