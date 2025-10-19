import React from 'react';
import VideoCard from './card';
import { Video } from '@/types/video';

type ContentProps = {
  videos: Video[];
  type: 'history' | 'liked' | 'watchlater';
  onRemove: (id: string) => void;
};

const Content: React.FC<ContentProps> = ({
  videos,
  type,
  onRemove,
}) => {

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-4">
        {videos.map((video, i) => (
          <VideoCard
            key={i}
            type="content" // VideoCard uses 'history' type for hover video preview
            video={{
              ...video,
              watchedon: type === 'history' ? video.watchedon : undefined,
            }}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
};

export default Content;
