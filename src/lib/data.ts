import fs from 'fs';
import path from 'path';
import { supabaseAdmin, isSupabaseConfigured } from './supabase';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const BLOGS_FILE = path.join(DATA_DIR, 'blogs.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure local directories exist as fallback
function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
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
  // 1. Try Supabase
  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('site_settings')
        .select('data')
        .eq('id', 'global')
        .single();
      if (!error && data?.data) {
        return data.data as SiteSettings;
      }
    } catch (e) {
      console.warn('Supabase site_settings error, using local fallback:', e);
    }
  }

  // 2. Local JSON fallback
  ensureDirs();
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const fileData = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      return JSON.parse(fileData);
    }
  } catch (err) {
    console.error('Error reading local settings:', err);
  }
  return {} as SiteSettings;
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

  // 1. Save to Supabase if configured
  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      await supabaseAdmin
        .from('site_settings')
        .upsert({ id: 'global', data: updated, updated_at: new Date().toISOString() });
    } catch (e) {
      console.warn('Supabase update site_settings error:', e);
    }
  }

  // 2. Always persist locally as well
  ensureDirs();
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

// ----------------- Blogs -----------------
export async function getBlogs(onlyPublished = false): Promise<BlogPost[]> {
  // 1. Try Supabase
  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      let query = supabaseAdmin
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (onlyPublished) {
        query = query.eq('published', true);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map((b: any) => ({
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
    } catch (e) {
      console.warn('Supabase getBlogs error, using local fallback:', e);
    }
  }

  // 2. Local JSON fallback
  ensureDirs();
  try {
    if (fs.existsSync(BLOGS_FILE)) {
      const data = fs.readFileSync(BLOGS_FILE, 'utf-8');
      const blogs: BlogPost[] = JSON.parse(data);
      return onlyPublished ? blogs.filter((b) => b.published) : blogs;
    }
  } catch (err) {
    console.error('Error reading local blogs:', err);
  }
  return [];
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const blogs = await getBlogs();
  return blogs.find((b) => b.slug === slug) || null;
}

export async function saveBlog(post: BlogPost): Promise<BlogPost> {
  // 1. Save to Supabase if configured
  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
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

      if (post.id && !post.id.startsWith('blog-')) {
        payload.id = post.id;
      }

      const { data, error } = await supabaseAdmin
        .from('blogs')
        .upsert(payload, { onConflict: 'slug' })
        .select('*')
        .single();

      if (!error && data) {
        post.id = data.id;
      }
    } catch (e) {
      console.warn('Supabase saveBlog error:', e);
    }
  }

  // 2. Local JSON update
  ensureDirs();
  const blogs = await getBlogs();
  const index = blogs.findIndex((b) => b.id === post.id || b.slug === post.slug);

  if (index >= 0) {
    blogs[index] = post;
  } else {
    blogs.unshift(post);
  }

  fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2), 'utf-8');
  return post;
}

export async function deleteBlog(id: string): Promise<boolean> {
  // 1. Delete from Supabase if configured
  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      await supabaseAdmin.from('blogs').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteBlog error:', e);
    }
  }

  // 2. Local JSON delete
  ensureDirs();
  const blogs = await getBlogs();
  const filtered = blogs.filter((b) => b.id !== id);
  if (filtered.length !== blogs.length) {
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  }
  return true;
}

// ----------------- Projects -----------------
export async function getProjects(onlyPublished = false): Promise<ProjectItem[]> {
  // 1. Try Supabase
  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      let query = supabaseAdmin
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true });

      if (onlyPublished) {
        query = query.eq('published', true);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map((p: any) => ({
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
    } catch (e) {
      console.warn('Supabase getProjects error, using local fallback:', e);
    }
  }

  // 2. Local JSON fallback
  ensureDirs();
  try {
    if (fs.existsSync(PROJECTS_FILE)) {
      const data = fs.readFileSync(PROJECTS_FILE, 'utf-8');
      const projects: ProjectItem[] = JSON.parse(data);
      const sorted = projects.sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99));
      return onlyPublished ? sorted.filter((p) => p.published) : sorted;
    }
  } catch (err) {
    console.error('Error reading local projects:', err);
  }
  return [];
}

export async function getProjectBySlug(slug: string): Promise<ProjectItem | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) || null;
}

export async function saveProject(project: ProjectItem): Promise<ProjectItem> {
  // 1. Supabase
  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
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

      const { data, error } = await supabaseAdmin
        .from('projects')
        .upsert(payload, { onConflict: 'slug' })
        .select('*')
        .single();

      if (!error && data) {
        project.id = data.id;
      }
    } catch (e) {
      console.warn('Supabase saveProject error:', e);
    }
  }

  // 2. Local JSON
  ensureDirs();
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.id === project.id || p.slug === project.slug);

  if (index >= 0) {
    projects[index] = project;
  } else {
    projects.push(project);
  }

  projects.sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99));
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');
  return project;
}

export async function deleteProject(id: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      await supabaseAdmin.from('projects').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteProject error:', e);
    }
  }

  ensureDirs();
  const projects = await getProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length !== projects.length) {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  }
  return true;
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
