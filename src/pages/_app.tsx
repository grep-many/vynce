import Header from '@/components/header';
import './globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/components/theme-provider';
import Sidebar from '@/components/sidebar';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="h-screen flex flex-col">
        <header className="sticky top-0 z-50 bg-background border-b">
          <Header />
        </header>

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-64 border-r overflow-y-auto bg-background">
            <Sidebar />
          </aside>

          <main className="flex-1 overflow-y-auto">
            <Component {...pageProps} />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
