import { ChannelContext } from '@/context/channel.context';
import React from 'react';

const useChannel = () => {
  const context = React.useContext(ChannelContext);
  if (context === undefined) {
    throw new Error('useChannel must be within a AuthProvider!');
  }
  return context;
};

export default useChannel;
