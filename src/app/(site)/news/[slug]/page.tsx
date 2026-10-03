import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogBySlug, getSettings } from '@/lib/data';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: 'Article Not Found' };

  return {
    title: blog.title,
    description: blog.summary,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  const settings = await getSettings();

  if (!blog) {
    notFound();
  }

  return (
    <>
      <section className="page-head">
        <div className="container">
          <p className="crumbs">
            <Link href="/news">Updates &amp; News</Link> / {blog.title}
          </p>
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span className="eyebrow" style={{ margin: 0 }}>{blog.category || 'Update'}</span>
            <span style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>&bull; {blog.date}</span>
            {blog.author && (
              <span style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>&bull; By {blog.author}</span>
            )}
          </div>
          <h1>{blog.title}</h1>
          <p className="lead">{blog.summary}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="prose">
            {blog.coverImage && (
              <div style={{ marginBottom: '2rem', borderRadius: '12px', overflow: 'hidden' }}>
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }}
                />
              </div>
            )}

            {blog.content.split('\n\n').map((paragraph, index) => {
              const trimmed = paragraph.trim();
              if (trimmed.startsWith('## ')) {
                return <h2 key={index}>{trimmed.replace('## ', '')}</h2>;
              }
              if (trimmed.startsWith('### ')) {
                return <h3 key={index}>{trimmed.replace('### ', '')}</h3>;
              }
              return <p key={index}>{trimmed}</p>;
            })}

            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--line)' }}>
              <Link className="more" href="/news">
                Back to all updates
              </Link>
            </div>
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
