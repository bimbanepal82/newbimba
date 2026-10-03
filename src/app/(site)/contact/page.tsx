'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <section className="page-head">
        <div className="container">
          <h1>Contact</h1>
          <p className="lead">
            Connect with BIMBA NEPAL for program information, partnerships, volunteering or support.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container narrow-grid">
          <div>
            <p className="eyebrow">Get in touch</p>
            <h2>Contact BIMBA NEPAL</h2>
          </div>
          <div className="prose">
            <dl className="contact-list">
              <div>
                <dt>Email</dt>
                <dd>
                  <a href="mailto:mail@bimba.org.np">mail@bimba.org.np</a>
                </dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>Kathmandu, Nepal</dd>
              </div>
              <div>
                <dt>Facebook</dt>
                <dd>
                  <a
                    href="https://www.facebook.com/profile.php?id=61590730554027"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    BIMBA NEPAL on Facebook
                  </a>
                </dd>
              </div>
              <div>
                <dt>Instagram</dt>
                <dd>
                  <a
                    href="https://www.instagram.com/bimba_nepal_org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @bimba_nepal_org
                  </a>
                </dd>
              </div>
            </dl>

            <div className="notice">
              <strong>Partnership and service:</strong> BIMBA Nepal's work is strengthened through collaboration with municipalities, health professionals, institutions, volunteers, pharmaceutical partners and community organizations.
            </div>

            <div style={{ marginTop: '2.5rem' }}>
              <h3>Send us a message</h3>
              {submitted ? (
                <div className="alert alert-success">
                  Thank you! Your message has been received. Our team will get back to you shortly.
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">Your Name</label>
                    <input id="name" type="text" className="form-input" placeholder="e.g. Maya Sharma" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Your Email</label>
                    <input id="email" type="email" className="form-input" placeholder="e.g. maya@example.com" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="subject">Subject / Inquiry</label>
                    <input id="subject" type="text" className="form-input" placeholder="Partnership, Volunteering, Inquiries" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="message">Message</label>
                    <textarea id="message" className="form-textarea" rows={4} placeholder="How can we collaborate?" required />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section band-tint">
        <div className="container cards">
          <article className="card">
            <div className="card-body">
              <p className="eyebrow">Program information</p>
              <h2>Our Work</h2>
              <p>Learn about BIMBA Nepal's work in women's wellbeing, health longevity service and emergency response.</p>
              <Link className="more" href="/projects">
                View projects
              </Link>
            </div>
          </article>
          <article className="card">
            <div className="card-body">
              <p className="eyebrow">Support</p>
              <h2>Donate</h2>
              <p>Support BIMBA NEPAL through the official donation QR provided on the Donate page.</p>
              <Link className="more" href="/donate">
                Donation information
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
