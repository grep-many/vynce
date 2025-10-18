import { ThemeProvider } from '@/components/theme-provider';
import React from 'react';
import { AuthProvider } from './auth.context';
import { Toaster } from '@/components/ui/sonner';
import { VideoProvider } from './video.context';
import { CommentProvider } from './comment.context';

const AppProvider = ({ children }: any) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <VideoProvider>
          <CommentProvider>
            <Toaster />
            {children}
          </CommentProvider>
        </VideoProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
