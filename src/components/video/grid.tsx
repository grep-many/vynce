import React from 'react';
import VideoCard from './card';
import { getVideos } from '@/services/video.service';
import { Video } from '@/types/video';
import { toast } from 'sonner';
import { Button } from '../ui/button';

const VideoGrid: React.FC = () => {
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  // Fetch videos on mount and when page changes
  const fetchVideos = async (newPage: number) => {
    setLoading(true);
    try {
      const res = await getVideos({ page: newPage });
      const fetchedVideos = Array.isArray(res.videos) ? res.videos : [];
      if (newPage === 1) {
        setVideos(fetchedVideos);
      } else {
        setVideos((prev) => [...prev, ...fetchedVideos]);
      }
      setTotal(res.total || 0);
      setPage(newPage);
    } catch (err: any) {
      console.error('Error fetching videos:', err);
      toast.error(err.message || 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchVideos(1); // initial fetch
  }, []);

  const loadMore = () => {
    if (videos.length >= total) return; // all videos loaded
    fetchVideos(page + 1);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos.length > 0 ? (
          videos.map((video) => <VideoCard key={video._id} video={video} />)
        ) : (
          <p className="col-span-full text-center text-muted-foreground">
            No videos found.
          </p>
        )}
      </div>

      {videos.length < total && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={loadMore}
            // className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoGrid;
