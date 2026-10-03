import React from 'react';
import Link from 'next/link';

interface FooterProps {
  logo?: string;
  tagline?: string;
  siteName?: string;
  email?: string;
  location?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

export default function Footer({
  logo = '/assets/logo.svg',
  tagline = 'Health • Longevity • Service',
  siteName = 'BIMBA NEPAL',
  email = 'mail@bimba.org.np',
  location = 'Kathmandu',
  facebookUrl = 'https://www.facebook.com/profile.php?id=61590730554027',
  instagramUrl = 'https://www.instagram.com/bimba_nepal_org/',
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <img
            className="footer-logo"
            src={logo}
            alt={siteName}
            width="156"
            height="50"
            loading="lazy"
          />
          <p className="footer-tag">{tagline}</p>
        </div>

        <div>
          <h2>Explore</h2>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/projects">Projects</Link></li>
            <li><Link href="/news">News</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/donate">Donate</Link></li>
          </ul>
        </div>

        <div>
          <h2>Contact</h2>
          <ul>
            <li>
              <a href={`mailto:${email}`}>{email}</a>
            </li>
            <li>{location}</li>
            {facebookUrl && (
              <li>
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </li>
            )}
            {instagramUrl && (
              <li>
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {currentYear} {siteName}</p>
        <div>
          <Link href="/admin" style={{ opacity: 0.75, fontSize: '0.85rem' }}>
            CPanel Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
