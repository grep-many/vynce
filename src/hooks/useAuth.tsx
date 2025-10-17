import { AuthContext } from '@/context/auth.context';
import React from 'react';

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be within a AuthProvider!');
  }
  return context;
};

export default useAuth;
