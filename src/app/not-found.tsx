import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '3rem 1rem' }}>
      <div className="container">
        <p className="eyebrow" style={{ fontSize: '1rem' }}>404 Error</p>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '0.8rem' }}>Page Not Found</h1>
        <p className="lead" style={{ margin: '0 auto 2rem', maxWidth: '36rem' }}>
          The page you are looking for does not exist or may have been moved.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/" className="btn btn-primary">
            Return Home
          </Link>
          <Link href="/projects" className="btn btn-outline">
            Explore Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
