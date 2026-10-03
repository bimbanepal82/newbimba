import React from 'react';
import Link from 'next/link';
import { getBlogs, getSettings } from '@/lib/data';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Updates & News',
  description: 'Project updates, health insights and announcements from BIMBA NEPAL.',
};

export default function NewsPage() {
  const blogs = getBlogs(true);
  const settings = getSettings();

  return (
    <>
      <section className="page-head">
        <div className="container">
          <h1>Updates &amp; News</h1>
          <p className="lead">
            Project updates and information from BIMBA NEPAL. Learn about our ongoing health camps, community initiatives, and partnerships.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container cards">
          {blogs.length === 0 ? (
            <div className="notice">No news updates published yet.</div>
          ) : (
            blogs.map((post) => (
              <article key={post.id} className="card">
                {post.coverImage && (
                  <div className="card-media">
                    <img src={post.coverImage} alt={post.title} />
                  </div>
                )}
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <p className="eyebrow" style={{ margin: 0 }}>{post.category || 'Update'}</p>
                    <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
                      {post.date}
                    </span>
                  </div>
                  <h2>
                    <Link href={`/news/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p>{post.summary}</p>
                  <div style={{ marginTop: 'auto', paddingTop: '0.8rem' }}>
                    <Link className="more" href={`/news/${post.slug}`}>
                      Read article
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="section band-tint">
        <div className="container narrow-grid">
          <div>
            <p className="eyebrow">Follow BIMBA NEPAL</p>
            <h2>Future updates</h2>
          </div>
          <div className="prose">
            <p>
              New program information, announcements, and health camp updates are continually published here. For questions or collaboration, please get in touch with our team.
            </p>
            <p>
              <Link className="more" href="/contact">
                Contact BIMBA NEPAL
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
