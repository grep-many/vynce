import Header from '@/components/header';
import './globals.css';
import type { AppProps } from 'next/app';
import Sidebar from '@/components/sidebar';
import AppProvider from '@/context';
import Head from 'next/head';
import React from 'react';
import useMobile from '@/hooks/useMobile';
import Offline from '@/components/offline';

export default function App({ Component, pageProps }: AppProps) {
  const isMobile = useMobile(1200);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [isOnline, setIsOnline] = React.useState(true);
  React.useEffect(() => setSidebarOpen(!isMobile), [isMobile]);

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

  return (
    <>
      <Head>
        <title>Vynce</title>
      </Head>
      <AppProvider>
        <div className="h-screen flex flex-col">
          <header className="sticky top-0 z-50 bg-background border-b">
            <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} />
          </header>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar
              sidebarOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />

            <main className="flex-1 overflow-y-auto">
              {!isOnline && (
                <div className="bg-destructive text-center py-2">
                  You are offline — showing cached videos
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
