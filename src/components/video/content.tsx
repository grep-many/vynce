'use client';

import React from 'react';
import { Clock, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoCard from './card';

type ContentProps = {
  title: string;
  videos: any[];
  user: any; // required
  type: 'history' | 'liked' | 'watchlater';
  emptyMessage?: string;
  onRemove: (id: string) => void;
};

const Content: React.FC<ContentProps> = ({
  title,
  videos,
  user,
  type,
  emptyMessage = 'No videos yet',
  onRemove,
}) => {
  if (!user) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">
          {type === 'liked'
            ? 'Keep track of videos you like'
            : type === 'watchlater'
            ? 'Save videos for later'
            : 'Keep track of what you watch'}
        </h2>
        <p className="text-gray-600">
          {type === 'liked'
            ? 'Sign in to see your liked videos.'
            : type === 'watchlater'
            ? 'Sign in to access your Watch Later playlist.'
            : 'Watch history isn’t viewable when signed out.'}
        </p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">{emptyMessage}</h2>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {(!(type=="history"))&&<div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">{videos.length} videos</p>
        <Button className="flex items-center gap-2">
          <Play className="w-4 h-4" />
          Play all
        </Button>
      </div>}

      <div className="space-y-4">
        {videos.map((item) => (
          <VideoCard
            key={item._id}
            type="content" // VideoCard uses 'history' type for hover video preview
            video={{
              ...item.video,
              watchedon: type === 'history' ? item.watchedon : undefined,
              likedOn: type === 'liked' ? item.likedOn : undefined,
              addedOn: type === 'watchlater' ? item.addedOn : undefined,
            }}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
};

export default Content;
