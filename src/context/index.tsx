import { ThemeProvider } from '@/components/theme-provider';
import React from 'react';
import { AuthProvider } from './auth.context';

const AppProvider = ({ children }: any) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
