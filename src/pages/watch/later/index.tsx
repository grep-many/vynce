'use client';

import React, { useState } from 'react';
import Content from '@/components/video/content';

const mockWatchLater = [
  {
    _id: 'w1',
    video: {
      _id: '1',
      title: 'Amazing Nature Documentary',
      filepath: '/vdo.mp4',
      channel: 'Nature Channel',
      views: 45000,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    addedOn: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: 'w2',
    video: {
      _id: '2',
      title: 'Cooking Tutorial: Perfect Pasta',
      filepath: '/vdo.mp4',
      channel: "Chef's Kitchen",
      views: 23000,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    addedOn: new Date(Date.now() - 7200000).toISOString(),
  },
];

const WatchLater = () => {
  const [videos, setVideos] = useState(mockWatchLater);
  const user = { id: '1', name: 'John Doe' }; // mock user

  const handleRemove = (id: string) => {
    console.log('Removing from watch later:', id);
    setVideos((prev) => prev.filter((v) => v._id !== id));
    // Here you can also call API to remove from watch later
  };

  return (
    <main className="p-6">
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Watch Later</h1>
        <Content
          title="Watch Later"
          videos={videos}
          type="watchlater"
          user={user}
          onRemove={handleRemove}
          emptyMessage="You haven't saved any videos for later."
        />
      </div>
    </main>
  );
};

export default WatchLater;
