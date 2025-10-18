// src/pages/index.tsx
import React from 'react';
import CategoryTab from '@/components/category-tabs';
import Loading from '@/components/loading';
import VideoGrid from '@/components/video/grid';
import useVideo from '@/hooks/useVideo';

const Home = () => {
  const { videos, total, loading, fetchVideos, page } = useVideo();

  const loadMore = () => {
    if (videos.length >= total) return;
    fetchVideos(page + 1);
  };

  return (
    <main className="p-4">
      <CategoryTab />
      <React.Suspense fallback={<Loading />}>
        <VideoGrid
          videos={videos}
          loading={loading}
          total={total}
          loadMore={loadMore}
        />
      </React.Suspense>
    </main>
  );
};

export default Home;
