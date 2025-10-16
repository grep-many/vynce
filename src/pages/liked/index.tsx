'use client';

import React, { useState } from 'react';
import Content from '@/components/video/content';
import { ThumbsUp } from 'lucide-react';

const mockLiked = [
  {
    _id: 'l1',
    video: {
      _id: '1',
      title: 'Amazing Nature Documentary',
      filepath: '/vdo.mp4',
      channel: 'Nature Channel',
      views: 45000,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    likedOn: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: 'l2',
    video: {
      _id: '2',
      title: 'Cooking Tutorial: Perfect Pasta',
      filepath: '/vdo.mp4',
      channel: "Chef's Kitchen",
      views: 23000,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    likedOn: new Date(Date.now() - 7200000).toISOString(),
  },
];

const Liked = () => {
  const [videos, setVideos] = useState(mockLiked);
  const user = { id: '1', name: 'John Doe' }; // mock user

  const handleRemove = (id: string) => {
    console.log('Removing from liked videos:', id);
    setVideos((prev) => prev.filter((v) => v._id !== id));
    // Here you can also call API to remove liked video
  };

  return (
    <main className="p-6">
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Liked Videos</h1>
        <Content
          title="Liked Videos"
          videos={videos}
          type="liked"
          user={user}
          onRemove={handleRemove}
          emptyMessage="You haven't liked any videos yet."
        />
      </div>
    </main>
  );
};

export default Liked;
