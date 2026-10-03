import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSettings } from '@/lib/data';

// Force dynamic rendering so edits in CPanel appear immediately on page refresh
export const dynamic = 'force-dynamic';

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <>
      <Header
        logo={settings.site?.logo}
        siteName={settings.site?.name}
        links={settings.nav?.links}
        donateButtonText={settings.nav?.donateButtonText}
        donateButtonHref={settings.nav?.donateButtonHref}
      />
      <main id="main" style={{ flex: 1 }}>
        {children}
      </main>
      <Footer
        logo={settings.site?.logo}
        tagline={settings.site?.tagline}
        siteName={settings.site?.name}
        email={settings.contact?.email}
        location={settings.contact?.location}
        facebookUrl={settings.contact?.facebookUrl}
        instagramUrl={settings.contact?.instagramUrl}
      />
    </>
  );
}
