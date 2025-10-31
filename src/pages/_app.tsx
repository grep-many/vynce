import Header from '@/components/header';
import './globals.css';
import type { AppProps } from 'next/app';
import Sidebar from '@/components/sidebar';
import AppProvider from '@/context';
import Head from 'next/head';
import React from 'react';
import useMobile from '@/hooks/useMobile';
import { toast } from 'sonner'; // ✅ import your toast utility

export default function App({ Component, pageProps }: AppProps) {
  const isMobile = useMobile(1200);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [isOnline, setIsOnline] = React.useState(true);

  // Adjust sidebar automatically for mobile
  React.useEffect(() => setSidebarOpen(!isMobile), [isMobile]);

  // Detect online/offline state
  React.useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online! ✅');
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.error('You’re offline — showing cached content ⚠️');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Register and handle Service Worker updates
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            toast.success('App is ready for offline use ⚡');

            // If there’s an updated SW waiting, activate it immediately
            if (registration.waiting) {
              registration.waiting.postMessage({ type: 'SKIP_WAITING' });
              toast.info('New update available! Reloading...');
              window.location.reload();
            }

            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (
                    newWorker.state === 'installed' &&
                    navigator.serviceWorker.controller
                  ) {
                    toast.info('New version installed! Reloading...');
                    window.location.reload();
                  }
                });
              }
            });
          })
          .catch(() => {
            toast.error('Failed to register Service Worker ❌');
          });

        // Reload when SW takes control
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });
      });
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
          <header className="sticky top-0 z-50 bg-background border-b">
            <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} />
          </header>

          <div className="flex flex-1 overflow-hidden">
            <Sidebar
              sidebarOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />

            <main className="flex-1 overflow-y-auto">
              {!isOnline && (
                <div className="bg-red-800 text-center text-white">
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