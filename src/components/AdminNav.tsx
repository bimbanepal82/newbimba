'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Heading,
  FileText,
  FolderKanban,
  Image as ImageIcon,
  ExternalLink,
  LogOut,
  ShieldCheck
} from 'lucide-react';

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error('Logout error', e);
    }
  };

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Headers & Hero', href: '/admin/headers', icon: Heading },
    { label: 'Blogs & News', href: '/admin/blogs', icon: FileText },
    { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { label: 'Media & Images', href: '/admin/media', icon: ImageIcon },
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <header className="admin-header">
      <div className="admin-header-title">
        <ShieldCheck size={24} color="#07529A" />
        <span>BIMBA CPanel</span>
        <span className="badge">Admin</span>
      </div>

      <nav className="admin-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-link ${active ? 'active' : ''}`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <Link
          href="/"
          target="_blank"
          className="btn btn-outline btn-sm"
          style={{ textDecoration: 'none' }}
        >
          <ExternalLink size={14} />
          <span>View Site</span>
        </Link>
        <button
          onClick={handleLogout}
          className="btn btn-danger btn-sm"
          title="Sign out"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
