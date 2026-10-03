'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  logo?: string;
  siteName?: string;
  links?: Array<{ label: string; href: string }>;
  donateButtonText?: string;
  donateButtonHref?: string;
}

export default function Header({
  logo = '/assets/logo.svg',
  siteName = 'BIMBA NEPAL',
  links = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'News', href: '/news' },
    { label: 'Contact', href: '/contact' },
  ],
  donateButtonText = 'Donate',
  donateButtonHref = '/donate',
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isCurrent = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="brand" aria-label={`${siteName} – home`}>
            <img src={logo} alt={siteName} width="175" height="56" />
          </Link>

          <button
            className="nav-toggle"
            type="button"
            aria-expanded={isOpen}
            aria-controls="site-nav"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">Menu</span>
            <span className="bars" aria-hidden="true"></span>
          </button>

          <nav id="site-nav" className={`site-nav ${isOpen ? 'open' : ''}`} aria-label="Main">
            <ul>
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isCurrent(link.href) ? 'page' : undefined}
                    className={isCurrent(link.href) ? 'active' : ''}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              className="btn btn-donate"
              href={donateButtonHref}
              onClick={() => setIsOpen(false)}
            >
              {donateButtonText}
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
