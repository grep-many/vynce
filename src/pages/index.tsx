'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CategoryTab from '@/components/category-tabs';
import Loading from '@/components/loading';
import VideoGrid from '@/components/video/grid';
import useVideo from '@/hooks/useVideo';
import NotFound from '@/components/not-found';

const Home: React.FC = () => {
  const router = useRouter();
  const { videos, total, loading, fetchVideos, page } = useVideo();

  React.useEffect(() => {
    fetchVideos({ page: 1 });
  }, []);

  // Loading state
  if (loading && videos.length === 0) {
    return <Loading />;
  }

  // No videos found
  if (!videos || videos.length === 0) {
    return (
      <NotFound
        message="No videos available at the moment!"
      />
    );
  }

  return (
    <main className="p-4">
      <CategoryTab />
      <React.Suspense fallback={<Loading />}>
        <VideoGrid
          videos={videos}
          loading={loading}
          total={total}
          page={page}
          onNext={() => fetchVideos({ page: page + 1 })}
          onPrev={() => fetchVideos({ page: page - 1 })}
        />
      </React.Suspense>
    </main>
  );
};

export default Home;
