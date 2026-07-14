import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    template: '%s — Rasmus Hansen',
    default: 'Rasmus Hansen — Software Developer',
  },
  description:
    'Rasmus Hansen — software developer, aikidoka, and long-term investor. Projects and writing on building toward a life split between Denmark and Japan.',
  openGraph: {
    type: 'website',
    siteName: 'Rasmus Hansen',
    locale: 'en_US',
    title: {
      template: '%s — Rasmus Hansen',
      default: 'Rasmus Hansen — Software Developer',
    },
    description:
      'Rasmus Hansen — software developer, aikidoka, and long-term investor. Projects and writing on building toward a life split between Denmark and Japan.',
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      template: '%s — Rasmus Hansen',
      default: 'Rasmus Hansen — Software Developer',
    },
    description:
      'Rasmus Hansen — software developer, aikidoka, and long-term investor. Projects and writing on building toward a life split between Denmark and Japan.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
