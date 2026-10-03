import React from 'react';
import Link from 'next/link';
import { getProjects } from '@/lib/data';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Project Photo Gallery',
  description: 'Project photography gallery for BIMBA NEPAL initiatives.',
};

export default function GalleryPage() {
  const projects = getProjects(true);

  return (
    <>
      <section className="page-head">
        <div className="container">
          <p className="crumbs">
            <Link href="/">Home</Link> / <Link href="/projects">Projects</Link> / Photo gallery
          </p>
          <h1>Project Photo Gallery</h1>
          <p className="lead">
            Visual documentation of BIMBA Nepal’s health camps, medical services, and community engagement. Photos can also be managed directly from the inbuilt CPanel.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cards">
            {projects.map((project) => (
              <article key={project.id} className="card">
                <div className="card-media">
                  <img
                    src={project.photos?.[0]?.url || project.featured_image || '/assets/projects/placeholder.svg'}
                    alt={project.title}
                  />
                </div>
                <div className="card-body">
                  <p className="eyebrow">{project.eyebrow || project.location_short}</p>
                  <h3>
                    <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                  </h3>
                  <p>{project.short_description}</p>
                  <Link className="more" href={`/projects/${project.slug}`}>
                    View project &amp; photos
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
