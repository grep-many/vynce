import { ThemeProvider } from '@/components/theme-provider';
import React from 'react';
import { AuthProvider } from './auth.context';
import { Toaster } from '@/components/ui/sonner';
import { VideoProvider } from './video.context';
import { CommentProvider } from './comment.context';
import { LikeProvider } from './like.context';
import { WatchProvider } from './watch.context';
import { HistoryProvider } from './history.context';
import { ChannelProvider } from './channel.context';

const AppProvider = ({ children }: any) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <ChannelProvider>
          <VideoProvider>
            <CommentProvider>
              <LikeProvider>
                <WatchProvider>
                  <HistoryProvider>
                    <Toaster />
                    {children}
                  </HistoryProvider>
                </WatchProvider>
              </LikeProvider>
            </CommentProvider>
          </VideoProvider>
        </ChannelProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
