import CategoryTab from '@/components/category-tabs';
import Loading from '@/components/loading';
import VideoGrid from '@/components/video/grid';
import React from 'react';

const Home = () => {
  return (
    <main className="p-4">
      <CategoryTab />
      <React.Suspense fallback={<Loading />}>
        <VideoGrid/>
      </React.Suspense>
    </main>
  );
};

export default Home;
