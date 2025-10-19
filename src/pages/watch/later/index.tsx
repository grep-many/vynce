'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Content from '@/components/video/content';
import useWatchLater from '@/hooks/useWatch';
import useAuth from '@/hooks/useAuth';
import NotFound from '@/components/not-found';

const WatchLater: React.FC = () => {
  const router = useRouter();
  const { videos, setVideos, fetchWatchLaterVideos, toggleWatchLater } =
    useWatchLater();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) fetchWatchLaterVideos();
  }, [user]);

  const handleRemove = async (id: string) => {
    await toggleWatchLater(id);
    setVideos((prev) => prev.filter((v) => v._id !== id));
  };

  // Not signed in
  if (!user) {
    return (
      <NotFound
        message="You need to sign in to view your watch later list."
        button={{
          text: 'Sign In',
          onClick: () => router.push('/signin'),
        }}
      />
    );
  }

  // No watch later videos
  if (videos.length === 0) {
    return (
      <NotFound
        message="You haven’t saved any videos for later."
        button={{
          text: 'Explore Videos',
          onClick: () => router.push('/'),
        }}
      />
    );
  }

  return (
    <main className="p-6">
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Watch Later</h1>
        <Content
          videos={videos}
          type="watchlater"
          user={user}
          onRemove={handleRemove}
          emptyMessage="" // emptyMessage handled with NotFound
        />
      </div>
    </main>
  );
};

export default WatchLater;
