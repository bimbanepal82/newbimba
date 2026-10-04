import fs from 'fs';
import path from 'path';
import { supabaseAdmin, isSupabaseConfigured } from './supabase';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

function getSupabaseAdmin() {
  if (!isSupabaseConfigured() || !supabaseAdmin) {
    throw new Error('Supabase is not configured. Set the Supabase URL and service role key.');
  }
  return supabaseAdmin;
}

// ----------------- Types -----------------
export interface SiteSettings {
  site: {
    name: string;
    tagline: string;
    description: string;
    logo: string;
    logoMark: string;
    favicon: string;
    ogImage: string;
  };
  nav: {
    links: Array<{ label: string; href: string }>;
    donateButtonText: string;
    donateButtonHref: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    primaryBtnText: string;
    primaryBtnLink: string;
    secondaryBtnText: string;
    secondaryBtnLink: string;
    heroMark: string;
  };
  aboutTeaser: {
    title: string;
    p1: string;
    p2: string;
    linkText: string;
    linkHref: string;
  };
  vision: {
    eyebrow: string;
    title: string;
    p1: string;
    p2: string;
  };
  focus: {
    title: string;
    lead: string;
    chips: string[];
  };
  dignifiedAgeing: {
    eyebrow: string;
    title: string;
    p1: string;
    p2: string;
  };
  supportCta: {
    title: string;
    lead: string;
    btnText: string;
    btnLink: string;
  };
  donation: {
    qrImage: string;
    bankName: string;
    branchName: string;
    accountNumber: string;
    amounts: number[];
  };
  contact: {
    email: string;
    location: string;
    facebookUrl: string;
    facebookLabel: string;
    instagramUrl: string;
    instagramLabel: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  author: string;
  summary: string;
  coverImage?: string;
  content: string;
  published: boolean;
}

export interface ProjectStat {
  value: string;
  label: string;
}

export interface ProjectPhoto {
  url: string;
  caption: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  eyebrow: string;
  location: string;
  location_short: string;
  date_text: string;
  status: string;
  sort_order: number;
  short_description: string;
  featured_image: string;
  stats_title: string;
  stats: ProjectStat[];
  content: string;
  photos: ProjectPhoto[];
  published: boolean;
}

export interface MediaFile {
  name: string;
  url: string;
  size: number;
  createdAt: string;
  fileType?: string;
}

// ----------------- Site Settings -----------------
export async function getSettings(): Promise<SiteSettings> {
  const { data, error } = await getSupabaseAdmin()
    .from('site_settings')
    .select('data')
    .eq('id', 'global')
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load site settings from Supabase: ${error.message}`);
  }

  if (!data?.data) {
    throw new Error('Site settings are missing in Supabase. Run supabase/schema.sql to seed the global settings.');
  }
  return data.data as SiteSettings;
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSettings();
  const updated: SiteSettings = {
    ...current,
    ...settings,
    site: { ...current.site, ...settings.site },
    nav: { ...current.nav, ...settings.nav },
    hero: { ...current.hero, ...settings.hero },
    aboutTeaser: { ...current.aboutTeaser, ...settings.aboutTeaser },
    vision: { ...current.vision, ...settings.vision },
    focus: { ...current.focus, ...settings.focus },
    dignifiedAgeing: { ...current.dignifiedAgeing, ...settings.dignifiedAgeing },
    supportCta: { ...current.supportCta, ...settings.supportCta },
    donation: { ...current.donation, ...settings.donation },
    contact: { ...current.contact, ...settings.contact },
  };

  const { error } = await getSupabaseAdmin()
    .from('site_settings')
    .upsert({ id: 'global', data: updated, updated_at: new Date().toISOString() });
  if (error) {
    throw new Error(`Failed to update site settings in Supabase: ${error.message}`);
  }

  return updated;
}

// ----------------- Blogs -----------------
export async function getBlogs(onlyPublished = false): Promise<BlogPost[]> {
  let query = getSupabaseAdmin()
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });

  if (onlyPublished) {
    query = query.eq('published', true);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to load blogs from Supabase: ${error.message}`);
  }

  return (data || []).map((b: any) => ({
    id: b.id,
    title: b.title,
    slug: b.slug,
    category: b.category,
    date: b.date,
    author: b.author,
    summary: b.summary,
    coverImage: b.cover_image,
    content: b.content,
    published: b.published,
  }));
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const blogs = await getBlogs();
  return blogs.find((b) => b.slug === slug) || null;
}

export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  let query = getSupabaseAdmin().from('blogs').select('id').eq('slug', slug);
  
  if (excludeId) query = query.neq('id', excludeId);

  const { data} = await query.limit(1);

  //  by pass for new blog post creation, if data is null or empty, return false
  if (!data) {
    return false;
  }
  return !!data && data.length > 0;
}

export async function saveBlog(post: BlogPost): Promise<BlogPost> {
   const slug = post.slug;

   const isExisting = !!post.id && !post.id.startsWith('blog-');

   if (!slug) {
    const err: any = new Error('Could not generate a slug from this title');
    err.code = 'SLUG_INVALID';
    throw err;
  }

const slugAlreadyExists = await slugExists(slug, isExisting ? post.id : undefined);
 
if (slugAlreadyExists) {
    const err: any = new Error(`Slug "${slug}" is already in use`);
    err.code = 'SLUG_EXISTS';
    throw err;
  }
  const payload: any = {
    title: post.title,
    slug: post.slug,
    category: post.category,
    date: post.date,
    author: post.author,
    summary: post.summary,
    cover_image: post.coverImage,
    content: post.content,
    published: post.published,
    updated_at: new Date().toISOString(),
  };

  if (isExisting) {
    payload.id = post.id;
  }
   const table = getSupabaseAdmin().from('blogs');
    const query = isExisting
    ? table.upsert(payload, { onConflict: 'id' })
    : table.insert(payload);

 const { data, error } = await query.select('*').single();

  if (error) {
    throw new Error(`Failed to save blog in Supabase: ${error.message}`);
  }

  post.id = data.id;
  return post;
}

export async function deleteBlog(id: string): Promise<boolean> {
  const { data, error } = await getSupabaseAdmin()
    .from('blogs')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle();
  if (error) {
    throw new Error(`Failed to delete blog from Supabase: ${error.message}`);
  }
  return Boolean(data);
}

// ----------------- Projects -----------------
export async function getProjects(onlyPublished = false): Promise<ProjectItem[]> {
  let query = getSupabaseAdmin()
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true });

  if (onlyPublished) {
    query = query.eq('published', true);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to load projects from Supabase: ${error.message}`);
  }

  return (data || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    eyebrow: p.eyebrow,
    location: p.location,
    location_short: p.location_short,
    date_text: p.date_text,
    status: p.status,
    sort_order: p.sort_order,
    short_description: p.short_description,
    featured_image: p.featured_image,
    stats_title: p.stats_title,
    stats: p.stats || [],
    content: p.content,
    photos: p.photos || [],
    published: p.published,
  }));
}

export async function getProjectBySlug(slug: string): Promise<ProjectItem | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) || null;
}

export async function saveProject(project: ProjectItem): Promise<ProjectItem> {
  const payload: any = {
    title: project.title,
    slug: project.slug,
    eyebrow: project.eyebrow,
    location: project.location,
    location_short: project.location_short,
    date_text: project.date_text,
    status: project.status,
    sort_order: project.sort_order,
    short_description: project.short_description,
    featured_image: project.featured_image,
    stats_title: project.stats_title,
    stats: project.stats || [],
    content: project.content,
    photos: project.photos || [],
    published: project.published,
    updated_at: new Date().toISOString(),
  };

  if (project.id && !project.id.startsWith('project-')) {
    payload.id = project.id;
  }

  const { data, error } = await getSupabaseAdmin()
    .from('projects')
    .upsert(payload, { onConflict: 'slug' })
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to save project in Supabase: ${error.message}`);
  }
  project.id = data.id;
  return project;
}

export async function deleteProject(id: string): Promise<boolean> {
  const { data, error } = await getSupabaseAdmin()
    .from('projects')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle();
  if (error) {
    throw new Error(`Failed to delete project from Supabase: ${error.message}`);
  }
  return Boolean(data);
}

// ----------------- Media Files -----------------
export async function getMediaFiles(): Promise<MediaFile[]> {
  const mediaList: MediaFile[] = [];

  // 1. Try Supabase media table
  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        for (const item of data) {
          mediaList.push({
            name: item.name,
            url: item.url,
            size: item.size || 0,
            createdAt: item.created_at,
            fileType: item.file_type,
          });
        }
      }
    } catch (e) {
      console.warn('Supabase getMediaFiles error:', e);
    }
  }

  // 2. Also check local uploads & assets so nothing is missed
  if (fs.existsSync(UPLOADS_DIR)) {
    const files = fs.readdirSync(UPLOADS_DIR);
    for (const file of files) {
      try {
        const filePath = path.join(UPLOADS_DIR, file);
        const stat = fs.statSync(filePath);
        if (stat.isFile() && !mediaList.some((m) => m.name === file)) {
          mediaList.push({
            name: file,
            url: `/uploads/${file}`,
            size: stat.size,
            createdAt: stat.birthtime.toISOString(),
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  const assetsDir = path.join(process.cwd(), 'public', 'assets');
  if (fs.existsSync(assetsDir)) {
    const assets = fs.readdirSync(assetsDir);
    for (const file of assets) {
      try {
        const filePath = path.join(assetsDir, file);
        const stat = fs.statSync(filePath);
        if (stat.isFile() && /\.(svg|png|jpg|jpeg|webp)$/i.test(file)) {
          mediaList.push({
            name: `assets/${file}`,
            url: `/assets/${file}`,
            size: stat.size,
            createdAt: stat.birthtime.toISOString(),
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  return mediaList.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
}
