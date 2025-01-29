import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer';
import ArticleContextProvider from '@/context/ArticleContext';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'IR Lens',
  description: 'International Relations News',
  icons: {
    icon: [
      { url: '/logos/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/logos/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/logos/favicon.ico', type: 'image/x-icon' },
    ],
    apple: '/logos/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        url: '/logos/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/logos/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className='scroll-smooth'>
      <body>
        <ArticleContextProvider>
          <Header />
          <main>
            {children}
            <Analytics />
            <Toaster />
          </main>
          <Footer />
        </ArticleContextProvider>
      </body>
    </html>
  );
}
