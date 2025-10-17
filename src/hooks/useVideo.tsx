import { VideoContext } from '@/context/video.context';
import React from 'react';

const useVideo = () => {
  const context = React.useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be within a VideoProvider!');
  }
  return context;
};

export default useVideo;
