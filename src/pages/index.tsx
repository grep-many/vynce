import CategoryTab from '@/components/category-tabs';
import Loading from '@/components/loading';
import VideoGrid from '@/components/video/grid';
import React, { Suspense } from 'react';

const Home = () => {
  return (
    <main className="p-4">
      <CategoryTab />
      <Suspense fallback={<Loading />}>
        <VideoGrid/>
      </Suspense>
    </main>
  );
};

export default Home;
