'use client';
import React from 'react';
import Content from '@/components/video/content';
import useWatchLater from '@/hooks/useWatch';
import useAuth from '@/hooks/useAuth';

const WatchLater = () => {
  const { videos, setVideos, fetchWatchLaterVideos, toggleWatchLater } =
    useWatchLater();
  const { user } = useAuth();

  React.useEffect(() => {
    fetchWatchLaterVideos();
  }, []);

  const handleRemove = async (id: string) => {
    await toggleWatchLater(id);
    setVideos((prev) => prev.filter((v) => v._id !== id));
  };

  return (
    <main className="p-6">
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Watch Later</h1>
        <Content
          videos={videos}
          type="watchlater"
          user={user}
          onRemove={handleRemove}
          emptyMessage="You haven’t saved any videos for later."
        />
      </div>
    </main>
  );
};

export default WatchLater;
