import { WatchContext } from '@/context/watch.context';
import React from 'react';

const useWatch = () => {
  const context = React.useContext(WatchContext);
  if (context === undefined) {
    throw new Error('useWatch must be within a watchContext!');
  }
  return context;
};

export default useWatch;
