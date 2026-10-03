import type { Metadata } from 'next';
import './globals.css';
import { getSettings } from '@/lib/data';

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  const siteName = settings.site?.name || 'BIMBA NEPAL';
  const tagline = settings.site?.tagline || 'Health • Longevity • Service';
  const description =
    settings.site?.description ||
    'BIMBA Nepal is a community-oriented organization working toward healthier communities and more empowered lives through health services, community engagement, partnership and responsive action.';

  return {
    metadataBase: new URL('https://bimba.org.np'),
    title: {
      default: `${siteName} – ${tagline}`,
      template: `%s – ${siteName}`,
    },
    description,
    icons: {
      icon: settings.site?.favicon || '/favicon.svg',
    },
    openGraph: {
      type: 'website',
      siteName,
      title: `${siteName} – ${tagline}`,
      description,
      images: [settings.site?.ogImage || '/assets/og-default.svg'],
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#07529A" />
      </head>
      <body>{children}</body>
    </html>
  );
}
