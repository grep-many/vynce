import React from 'react';
import VideoCard from './card';
import { Video } from '@/types/video';
import { Button } from '../ui/button';

interface Prop {
  videos: Video[];
  loading: boolean;
  total: number;
  loadMore: () => void;
}

const VideoGrid: React.FC<Prop> = ({ videos, loading, total, loadMore }) => {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos.length > 0 ? (
          videos.map((video, i) => <VideoCard key={i} video={video} />)
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
