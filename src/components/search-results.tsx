import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import useVideo from '@/hooks/useVideo';
import VideoGrid from '@/components/video/grid';
import Loading from '@/components/loading';

const SearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const { videos, total, loading, fetchVideos, page } = useVideo();

  // Fetch videos whenever query or page changes
  useEffect(() => {
    if (query.trim()) {
      fetchVideos({ page: pageParam, search: query, replace: true });
    }
  }, [query, pageParam]);

  const handleNext = () => {
    if (page * 10 >= total) return;
    router.push(`/search?q=${encodeURIComponent(query)}&page=${page + 1}`);
  };

  const handlePrev = () => {
    if (page <= 1) return;
    router.push(`/search?q=${encodeURIComponent(query)}&page=${page - 1}`);
  };

  if (loading) return <Loading />;

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No results found</h2>
        <p className="text-muted-foreground">
          Try different keywords or remove search filters
        </p>
      </div>
    );
  }

  return (
    <main className="p-4 max-w-5xl mx-auto">
      <VideoGrid
        videos={videos}
        total={total}
        page={page}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </main>
  );
};

export default SearchPage;
