import './globals.css';
import './site-polish.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Fatima Online Quran Academy | Learn Quran Online', template: '%s | Fatima Online Quran Academy' },
  description: 'Personal online Quran classes for children and adults. Explore Noorani Qaida, Quran Reading, Tajweed, Hifz, Arabic and Islamic Studies.',
  applicationName: 'Fatima Online Quran Academy',
  openGraph: {
    type: 'website',
    siteName: 'Fatima Online Quran Academy',
    title: 'Fatima Online Quran Academy',
    description: 'Learn the Quran online with personal guidance, flexible class schedules and a free trial inquiry.',
    url: siteUrl,
  },
  robots: { index: true, follow: true },
};

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#0b0a11' };

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
