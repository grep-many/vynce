import Header from '@/components/header';
import './globals.css';
import type { AppProps } from 'next/app';
import Sidebar from '@/components/sidebar';
import AppProvider from '@/context';
import Head from 'next/head';
import React from 'react';
import useMobile from '@/hooks/useMobile';

export default function App({ Component, pageProps }: AppProps) {
  const isMobile = useMobile(1200);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [isOnline, setIsOnline] = React.useState(true);

  // Adjust sidebar based on mobile
  React.useEffect(() => setSidebarOpen(!isMobile), [isMobile]);

  // Online/offline detection
  React.useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Register Service Worker for caching pages
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) =>
          console.log('Service Worker registered:', registration),
        )
        .catch((error) =>
          console.error('Service Worker registration failed:', error),
        );
    }
  }, []);

  return (
    <>
      <Head>
        <title>Vynce - Watch & Share Videos</title>
        <meta
          name="description"
          content="Watch, like, and share videos on Vynce — your next-generation video platform inspired by YouTube."
        />
        <meta property="og:title" content="Vynce - Watch & Share Videos" />
        <meta
          property="og:description"
          content="Experience streaming and content creation like never before."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/android-chrome-512x512.png" />
        <meta property="og:url" content="https://vynce.vercel.app/" />
        <link rel="canonical" href="https://vynce.vercel.app/" />
    </Head>
      <AppProvider>
        <div className="h-screen flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-background border-b">
            <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} />
          </header>

          {/* Main layout */}
          <div className="flex flex-1 overflow-hidden">
            <Sidebar
              sidebarOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />

            <main className="flex-1 overflow-y-auto">
              {!isOnline && (
                <div className="bg-destructive text-center py-2">
                  You are offline — showing cached content
                </div>
              )}
              <Component {...pageProps} />
            </main>
          </div>
        </div>
      </AppProvider>
    </>
  );
}
