import "../globals.css";
import { Analytics } from '@vercel/analytics/next';
import { Inter, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { SUPPORTED_LOCALES, normalizeLocale } from '@/lib/i18n';
import { getAlternates, getOpenGraph, getTwitter, SITE_URL } from '@/lib/seo';

const display = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
  preload: true
});

const body = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
  preload: true
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
  preload: true
});

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  authors: [{ name: 'Johan Lorck' }],
  creator: 'Johan Lorck',
  alternates: getAlternates('/'),
  openGraph: getOpenGraph('en', '/'),
  twitter: getTwitter('en'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const normalizedLocale = normalizeLocale(locale);

  if (normalizedLocale !== locale) {
    notFound();
  }

  return (
    <html lang={normalizedLocale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body className={`${display.variable} ${body.variable} ${mono.variable} ${body.className}`}>
        <div className="main-container">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
