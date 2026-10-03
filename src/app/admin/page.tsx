'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Heading,
  FileText,
  FolderKanban,
  Image as ImageIcon,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { SiteSettings, BlogPost, ProjectItem, MediaFile } from '@/lib/data';

export default function AdminDashboardPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsRes, blogsRes, projectsRes, mediaRes] = await Promise.all([
          fetch('/api/admin/settings'),
          fetch('/api/admin/blogs'),
          fetch('/api/admin/projects'),
          fetch('/api/admin/media'),
        ]);

        const [settingsData, blogsData, projectsData, mediaData] = await Promise.all([
          settingsRes.json(),
          blogsRes.json(),
          projectsRes.json(),
          mediaRes.json(),
        ]);

        setSettings(settingsData);
        setBlogs(blogsData);
        setProjects(projectsData);
        setMedia(mediaData);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-muted)' }}>
        Loading CPanel Dashboard...
      </div>
    );
  }

  const publishedBlogs = blogs.filter((b) => b.published).length;

  return (
    <div>
      {/* Top Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.8rem', margin: 0 }}>CPanel Dashboard</h1>
          <p style={{ color: 'var(--admin-muted)', margin: '0.2rem 0 0' }}>
            Welcome to the BIMBA Nepal content management system. Manage blogs, headers, projects, and images in real time.
          </p>
        </div>
        <Link href="/" target="_blank" className="btn btn-primary btn-sm">
          <ExternalLink size={14} /> Open Live Site
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gap: '1.2rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          marginBottom: '2rem',
        }}
      >
        <div className="admin-card" style={{ padding: '1.4rem', margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--admin-muted)', fontWeight: 600 }}>
                BLOGS &amp; NEWS
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--navy)', marginTop: '0.2rem' }}>
                {blogs.length}
              </div>
            </div>
            <div style={{ padding: '0.5rem', background: 'var(--blue-tint)', borderRadius: '8px' }}>
              <FileText size={22} color="var(--blue)" />
            </div>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--admin-muted)', marginTop: '0.8rem' }}>
            <span style={{ color: 'var(--green-dark)', fontWeight: 600 }}>{publishedBlogs} published</span> &bull; {blogs.length - publishedBlogs} drafts
          </div>
        </div>

        <div className="admin-card" style={{ padding: '1.4rem', margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--admin-muted)', fontWeight: 600 }}>
                PROJECTS
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--navy)', marginTop: '0.2rem' }}>
                {projects.length}
              </div>
            </div>
            <div style={{ padding: '0.5rem', background: 'var(--green-tint)', borderRadius: '8px' }}>
              <FolderKanban size={22} color="var(--green-dark)" />
            </div>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--admin-muted)', marginTop: '0.8rem' }}>
            Health initiatives and community programs
          </div>
        </div>

        <div className="admin-card" style={{ padding: '1.4rem', margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--admin-muted)', fontWeight: 600 }}>
                MEDIA &amp; IMAGES
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--navy)', marginTop: '0.2rem' }}>
                {media.length}
              </div>
            </div>
            <div style={{ padding: '0.5rem', background: '#F1F5F9', borderRadius: '8px' }}>
              <ImageIcon size={22} color="#475569" />
            </div>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--admin-muted)', marginTop: '0.8rem' }}>
            Logos, QR code, and uploaded project photos
          </div>
        </div>

        <div className="admin-card" style={{ padding: '1.4rem', margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--admin-muted)', fontWeight: 600 }}>
                SITE STATUS
              </span>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#15803D', marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={20} /> Live &amp; Ready
              </div>
            </div>
            <div style={{ padding: '0.5rem', background: '#DCFCE7', borderRadius: '8px' }}>
              <Sparkles size={22} color="#15803D" />
            </div>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--admin-muted)', marginTop: '0.8rem' }}>
            Next.js SSR &bull; Inbuilt File Storage
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Quick Actions</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
          <Link href="/admin/headers" className="btn btn-outline btn-sm">
            <Heading size={16} /> Edit Headers &amp; Hero
          </Link>
          <Link href="/admin/blogs" className="btn btn-outline btn-sm">
            <FileText size={16} /> Manage Blogs
          </Link>
          <Link href="/admin/blogs?new=1" className="btn btn-primary btn-sm">
            <PlusCircle size={16} /> Create New Blog
          </Link>
          <Link href="/admin/projects" className="btn btn-outline btn-sm">
            <FolderKanban size={16} /> Manage Projects
          </Link>
          <Link href="/admin/media" className="btn btn-outline btn-sm">
            <ImageIcon size={16} /> Upload &amp; Browse Images
          </Link>
        </div>
      </div>

      {/* Two columns: Current Hero & Recent Blogs */}
      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {/* Left: Active Hero Preview */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2>Current Hero Header</h2>
              <p>Active headline and CTA buttons shown on homepage</p>
            </div>
            <Link href="/admin/headers" className="more" style={{ fontSize: '0.85rem' }}>
              Edit
            </Link>
          </div>
          {settings?.hero && (
            <div
              style={{
                background: 'linear-gradient(180deg, var(--green-tint), #fff)',
                padding: '1.4rem',
                borderRadius: '8px',
                border: '1px solid var(--line)',
              }}
            >
              <p className="eyebrow" style={{ fontSize: '0.75rem' }}>{settings.hero.eyebrow}</p>
              <h3 style={{ fontSize: '1.3rem', margin: '0.3rem 0' }}>{settings.hero.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: '0.5rem 0 1rem' }}>
                {settings.hero.lead}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span className="btn btn-primary btn-sm" style={{ pointerEvents: 'none' }}>
                  {settings.hero.primaryBtnText}
                </span>
                <span className="btn btn-donate btn-sm" style={{ pointerEvents: 'none' }}>
                  {settings.hero.secondaryBtnText}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Recent Blogs */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2>Latest Blogs &amp; News</h2>
              <p>Recently updated articles</p>
            </div>
            <Link href="/admin/blogs" className="more" style={{ fontSize: '0.85rem' }}>
              View all
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {blogs.slice(0, 3).map((blog) => (
              <div
                key={blog.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.8rem',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '8px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{blog.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--admin-muted)', marginTop: '0.2rem' }}>
                    {blog.category} &bull; {blog.date}
                  </div>
                </div>
                <span
                  className={`badge-status ${
                    blog.published ? 'badge-published' : 'badge-draft'
                  }`}
                >
                  {blog.published ? 'Published' : 'Draft'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
