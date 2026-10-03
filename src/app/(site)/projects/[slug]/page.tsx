import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getProjects, getSettings } from '@/lib/data';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: project.title,
    description: project.short_description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const settings = getSettings();

  if (!project) {
    notFound();
  }

  // Parse simple markdown headings and lists for rendering
  const renderContent = (content: string) => {
    return content.split('\n\n').map((block, idx) => {
      const trimmed = block.trim();
      if (trimmed.startsWith('## ')) {
        return <h2 key={idx}>{trimmed.replace('## ', '')}</h2>;
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={idx}>{trimmed.replace('### ', '')}</h3>;
      }
      if (trimmed.startsWith('- ')) {
        const items = trimmed.split('\n').map((item) => item.replace(/^- /, '').trim());
        return (
          <ul key={idx}>
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
      }
      // Simple bold replacement
      const formatted = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return (
        <p
          key={idx}
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
  };

  return (
    <>
      <section className="page-head">
        <div className="container">
          <p className="crumbs">
            <Link href="/projects">Projects</Link> / {project.title}
          </p>
          <h1>{project.title}</h1>
          <p className="lead">{project.short_description}</p>
        </div>
      </section>

      {/* Stats counter band if stats exist */}
      {project.stats && project.stats.length > 0 && (
        <section className="section band-tint">
          <div className="container">
            <h2>{project.stats_title || 'Program Highlights'}</h2>
            <ul className="stats">
              {project.stats.map((stat, i) => (
                <li key={i}>
                  <span className="stat-num">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Project Body */}
      <section className="section">
        <div className="container">
          <div className="prose">
            {project.location && (
              <div className="notice notice-soft" style={{ marginBottom: '2rem' }}>
                <strong>Location:</strong> {project.location}
                {project.date_text && <span> &bull; <strong>Date:</strong> {project.date_text}</span>}
                {project.status && <span> &bull; <strong>Status:</strong> {project.status}</span>}
              </div>
            )}

            {renderContent(project.content)}

            {/* Photo Gallery if photos available */}
            {project.photos && project.photos.length > 0 && (
              <div style={{ marginTop: '3rem' }}>
                <h2>Project Photos</h2>
                <div className="photo-grid">
                  {project.photos.map((photo, i) => (
                    <figure key={i} className="photo-card">
                      <img src={photo.url} alt={photo.caption || project.title} />
                      {photo.caption && <figcaption>{photo.caption}</figcaption>}
                    </figure>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="section band-blue">
        <div className="container cta-row">
          <div>
            <h2>{settings.supportCta?.title || 'Support our work'}</h2>
            <p>{settings.supportCta?.lead || 'Health • Longevity • Service'}</p>
          </div>
          <Link className="btn btn-donate" href={settings.supportCta?.btnLink || '/donate'}>
            {settings.supportCta?.btnText || 'Donate'}
          </Link>
        </div>
      </section>
    </>
  );
}
