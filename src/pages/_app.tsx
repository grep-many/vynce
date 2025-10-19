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
  React.useEffect(() => setSidebarOpen(!isMobile), [isMobile]);

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
              <Component {...pageProps} />
            </main>
          </div>
        </div>
      </AppProvider>
    </>
  );
}
