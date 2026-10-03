'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminNav from '@/components/AdminNav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    async function checkAuth() {
      if (isLoginPage) {
        setChecking(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/check');
        const data = await res.json();
        if (!data.authenticated) {
          router.replace('/admin/login');
        } else {
          setIsAuth(true);
        }
      } catch (err) {
        router.replace('/admin/login');
      } finally {
        setChecking(false);
      }
    }

    checkAuth();
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <div className="admin-shell">{children}</div>;
  }

  if (checking) {
    return (
      <div className="admin-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--admin-muted)', fontWeight: 600 }}>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <AdminNav />
      <div className="admin-container">{children}</div>
    </div>
  );
}
