import CategoryTab from '@/components/category-tabs';
import Loading from '@/components/loading';
import VideoGrid from '@/components/video/grid';
import useVideo from '@/hooks/useVideo';
import React from 'react';

const Home = () => {
  const { videos, total, loading, fetchVideos, page } = useVideo();

  React.useEffect(() => {
    fetchVideos({page:1})
  },[])

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
