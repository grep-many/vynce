'use client';

import React, { useState } from 'react';
import Content from '@/components/video/content';

const mockHistory = [
  {
    _id: 'h1',
    video: {
      _id: '1',
      title: 'Amazing Nature Documentary',
      filepath: '/vdo.mp4',
      channel: 'Nature Channel',
      views: 45000,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    watchedon: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: 'h2',
    video: {
      _id: '2',
      title: 'Cooking Tutorial: Perfect Pasta',
      filepath: '/vdo.mp4',
      channel: "Chef's Kitchen",
      views: 23000,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    watchedon: new Date(Date.now() - 7200000).toISOString(),
  },
];

const History = () => {
  const [videos, setVideos] = useState(mockHistory);
  const user = { id: '1', name: 'John Doe' }; // mock user

  const handleRemove = (id: string) => {
    console.log('Removing from history:', id);
    setVideos((prev) => prev.filter((v) => v._id !== id));
    // Here you can also call API to remove from history
  };

  return (
    <main className="p-6">
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">History</h1>
        <Content
          title="History"
          videos={videos}
          type="history"
          user={user}
          onRemove={handleRemove}
          emptyMessage="You haven't watched any videos yet."
        />
      </div>
    </main>
  );
};

export default History;
