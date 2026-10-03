import type { Metadata, Viewport } from 'next';
import { Barlow, Barlow_Condensed } from 'next/font/google';
import './globals.css';
import { JSON_LD, jsonLdScript, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_TITLE, SITE_URL } from './site';

const display = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-display-face',
});

const body = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-body-face',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: 'Sahil Chalke', url: 'https://sahilchalke.com' }],
  creator: 'Sahil Chalke',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: '/',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@chalke1015',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#050c0e',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(JSON_LD) }} />
        {children}
      </body>
    </html>
  );
}
