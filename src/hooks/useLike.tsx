import { LikeContext } from '@/context/like.context';
import React from 'react';

const useLike = () => {
  const context = React.useContext(LikeContext);
  if (context === undefined) {
    throw new Error('useLike must be within a LikeProvider!');
  }
  return context;
};

export default useLike;
