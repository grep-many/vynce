import { ThemeProvider } from '@/components/theme-provider';
import React from 'react';
import { AuthProvider } from './auth.context';
import { ChannelProvider } from './channel.context';
import { Toaster } from '@/components/ui/sonner';


const AppProvider = ({ children }: any) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <ChannelProvider>
          <Toaster/>
          {children}
        </ChannelProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
