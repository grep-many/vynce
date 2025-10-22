import React from 'react';
import VideoCard from './card';
import { Button } from '../ui/button';

interface VideoGridProps {
  videos: any[];
  loading: boolean;
  total: number;
  page: number;
  onNext: () => void;
  onPrev: () => void;
}

const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  total,
  page,
  onNext,
  onPrev,
}) => {
  const totalPages = Math.ceil(total / videos.length || 1);

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos.map((video, i) => (
          <VideoCard key={i} video={video} />
        ))}
      </div>

      {/* Bottom Pagination */}
      {videos.length > 0 && (
        <div className="flex justify-between mt-6">
          <Button onClick={onPrev} disabled={page <= 1}>
            Prev
          </Button>
          <Button onClick={onNext} disabled={page >= totalPages}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoGrid;
