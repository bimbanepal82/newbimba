import React from 'react';
import Link from 'next/link';
import { getProjects, getSettings } from '@/lib/data';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Our Projects',
  description: 'BIMBA Nepal projects in women’s wellbeing, health longevity service and emergency response.',
};

export default function ProjectsPage() {
  const projects = getProjects(true);
  const settings = getSettings();

  return (
    <>
      <section className="page-head">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1>Our Projects</h1>
              <p className="lead">
                From community health and women’s wellbeing to healthy ageing and emergency response, our work begins with identified community needs.
              </p>
            </div>
            <Link href="/projects/gallery" className="btn btn-outline" style={{ marginTop: '0.5rem' }}>
              View Photo Gallery
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container cards">
          {projects.map((project) => (
            <article key={project.id} className="card">
              <div className="card-body">
                <p className="eyebrow">{project.eyebrow || project.location_short}</p>
                <h2>
                  <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                </h2>
                <p>{project.short_description}</p>
                <div style={{ marginTop: 'auto', paddingTop: '0.8rem' }}>
                  <Link className="more" href={`/projects/${project.slug}`}>
                    Read project
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

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
