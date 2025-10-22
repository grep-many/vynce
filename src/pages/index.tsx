import React from 'react';
import CategoryTab from '@/components/category-tabs';
import Loading from '@/components/loading';
import VideoGrid from '@/components/video/grid';
import useVideo from '@/hooks/useVideo';
import NotFound from '@/components/not-found';
import { GetServerSideProps } from 'next';
import { getVideos } from '@/services/video.service';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { videos } = await getVideos({});
    return {
      props: {
        videos: videos,
      },
    };
  } catch (err) {
    return {
      props: {
        videos: [],
      },
    };
  }
};

const Home: React.FC = () => {
  const { videos, total, loading, fetchVideos, page } = useVideo();

  React.useEffect(() => {
    fetchVideos({ page: 1, replace: true });
  }, []);

  if (loading) return <Loading />;

  // No videos found
  if (!videos || videos.length === 0) {
    return <NotFound message="No videos available at the moment!" />;
  }

  return (
    <>
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
    </>
  );
};

export default Home;
