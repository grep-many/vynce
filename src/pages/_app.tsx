import Header from '@/components/header';
import './globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/components/theme-provider';
import Sidebar from '@/components/sidebar';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 overflow-y-auto bg-background">
            <Component {...pageProps} />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
