import React from 'react';
import Link from 'next/link';
import { getSettings, getProjects } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const settings = await getSettings();
  const projects = await getProjects(true);

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <p className="eyebrow">{settings.hero?.eyebrow || 'Health • Longevity • Service'}</p>
            <h1>{settings.hero?.title || 'Healing Community, Empowering Life'}</h1>
            <p className="lead">{settings.hero?.lead}</p>
            <div className="btn-row">
              <Link className="btn btn-primary" href={settings.hero?.primaryBtnLink || '/projects'}>
                {settings.hero?.primaryBtnText || 'Our work'}
              </Link>
              <Link className="btn btn-donate" href={settings.hero?.secondaryBtnLink || '/donate'}>
                {settings.hero?.secondaryBtnText || 'Donate'}
              </Link>
            </div>
          </div>
          {settings.hero?.heroMark && (
            <div className="hero-media hero-mark" aria-hidden="true">
              <img
                src={settings.hero.heroMark}
                alt=""
                width="220"
                height="225"
              />
            </div>
          )}
        </div>
      </section>

      {/* About BIMBA Section */}
      <section className="section">
        <div className="container narrow-grid">
          <div>
            <h2>{settings.aboutTeaser?.title || 'About BIMBA NEPAL'}</h2>
          </div>
          <div className="prose">
            <p>{settings.aboutTeaser?.p1}</p>
            <p>{settings.aboutTeaser?.p2}</p>
            <p>
              <Link className="more" href={settings.aboutTeaser?.linkHref || '/about'}>
                {settings.aboutTeaser?.linkText || 'More about us'}
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Vision Band */}
      <section className="section band-tint">
        <div className="container narrow-grid">
          <div>
            <p className="eyebrow">{settings.vision?.eyebrow || 'Our Vision'}</p>
            <h2>{settings.vision?.title || 'Healing Community and Empowering Life'}</h2>
          </div>
          <div className="prose">
            <p>{settings.vision?.p1}</p>
            <p>{settings.vision?.p2}</p>
          </div>
        </div>
      </section>

      {/* Focus Chips */}
      <section className="section">
        <div className="container">
          <h2>{settings.focus?.title || 'Our Current Focus'}</h2>
          <p className="lead">{settings.focus?.lead}</p>
          <ul className="chips">
            {settings.focus?.chips?.map((chip, index) => (
              <li key={index}>{chip}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Projects Cards */}
      <section className="section band-soft">
        <div className="container">
          <div className="section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ margin: 0 }}>Our work so far</h2>
            <Link className="more" href="/projects">
              All projects
            </Link>
          </div>
          <div className="cards">
            {projects.map((project) => (
              <article key={project.id} className="card">
                <div className="card-body">
                  <p className="eyebrow">{project.eyebrow || project.location_short}</p>
                  <h3>
                    <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                  </h3>
                  <p>{project.short_description}</p>
                  <Link className="more" href={`/projects/${project.slug}`}>
                    Read more
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Dignified Ageing */}
      <section className="section">
        <div className="container narrow-grid">
          <div>
            <p className="eyebrow">{settings.dignifiedAgeing?.eyebrow || 'Dignified Ageing'}</p>
            <h2>{settings.dignifiedAgeing?.title || 'स्वाभिमानी बुढ्यौली — Dignified Ageing'}</h2>
          </div>
          <div className="prose">
            <p>{settings.dignifiedAgeing?.p1}</p>
            <p>{settings.dignifiedAgeing?.p2}</p>
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="section band-blue">
        <div className="container cta-row">
          <div>
            <h2>{settings.supportCta?.title || 'Support our work'}</h2>
            <p>{settings.supportCta?.lead || 'You can support BIMBA NEPAL by donating through the official bank QR code.'}</p>
          </div>
          <Link className="btn btn-donate" href={settings.supportCta?.btnLink || '/donate'}>
            {settings.supportCta?.btnText || 'Donate'}
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section">
        <div className="container narrow-grid">
          <div>
            <h2>Contact</h2>
          </div>
          <div className="prose">
            <p>
              Email: <a href={`mailto:${settings.contact?.email}`}>{settings.contact?.email}</a>
              <br />
              Location: {settings.contact?.location}
            </p>
            <p>
              <Link className="more" href="/contact">
                All contact details
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
