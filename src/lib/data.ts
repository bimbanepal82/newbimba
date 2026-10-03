import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const BLOGS_FILE = path.join(DATA_DIR, 'blogs.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure directories exist
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
}

// ----------------- Site Settings -----------------
export function getSettings(): SiteSettings {
  ensureDirs();
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading settings:', err);
  }
  return {} as SiteSettings;
}

export function updateSettings(settings: Partial<SiteSettings>): SiteSettings {
  ensureDirs();
  const current = getSettings();
  const updated = {
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
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

// ----------------- Blogs -----------------
export function getBlogs(onlyPublished = false): BlogPost[] {
  ensureDirs();
  try {
    if (fs.existsSync(BLOGS_FILE)) {
      const data = fs.readFileSync(BLOGS_FILE, 'utf-8');
      const blogs: BlogPost[] = JSON.parse(data);
      return onlyPublished ? blogs.filter((b) => b.published) : blogs;
    }
  } catch (err) {
    console.error('Error reading blogs:', err);
  }
  return [];
}

export function getBlogBySlug(slug: string): BlogPost | null {
  const blogs = getBlogs();
  return blogs.find((b) => b.slug === slug) || null;
}

export function saveBlog(post: BlogPost): BlogPost {
  ensureDirs();
  const blogs = getBlogs();
  const index = blogs.findIndex((b) => b.id === post.id);

  if (index >= 0) {
    blogs[index] = post;
  } else {
    blogs.unshift(post);
  }

  fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2), 'utf-8');
  return post;
}

export function deleteBlog(id: string): boolean {
  ensureDirs();
  const blogs = getBlogs();
  const filtered = blogs.filter((b) => b.id !== id);
  if (filtered.length !== blogs.length) {
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  }
  return false;
}

// ----------------- Projects -----------------
export function getProjects(onlyPublished = false): ProjectItem[] {
  ensureDirs();
  try {
    if (fs.existsSync(PROJECTS_FILE)) {
      const data = fs.readFileSync(PROJECTS_FILE, 'utf-8');
      const projects: ProjectItem[] = JSON.parse(data);
      const sorted = projects.sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99));
      return onlyPublished ? sorted.filter((p) => p.published) : sorted;
    }
  } catch (err) {
    console.error('Error reading projects:', err);
  }
  return [];
}

export function getProjectBySlug(slug: string): ProjectItem | null {
  const projects = getProjects();
  return projects.find((p) => p.slug === slug) || null;
}

export function saveProject(project: ProjectItem): ProjectItem {
  ensureDirs();
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === project.id);

  if (index >= 0) {
    projects[index] = project;
  } else {
    projects.push(project);
  }

  projects.sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99));
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');
  return project;
}

export function deleteProject(id: string): boolean {
  ensureDirs();
  const projects = getProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length !== projects.length) {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  }
  return false;
}

// ----------------- Media Files -----------------
export function getMediaFiles(): MediaFile[] {
  ensureDirs();
  const mediaList: MediaFile[] = [];

  // Check public/uploads
  if (fs.existsSync(UPLOADS_DIR)) {
    const files = fs.readdirSync(UPLOADS_DIR);
    for (const file of files) {
      try {
        const filePath = path.join(UPLOADS_DIR, file);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
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

  // Also include base assets (logo, mark, qr, etc.)
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
