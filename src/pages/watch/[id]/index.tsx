import VideoComments from '@/components/video/comments';
import VideoInfo from '@/components/video/info';
import VideoPlayer from '@/components/video/player';
import RelatedVideos from '@/components/video/related';
import useVideo from '@/hooks/useVideo';
import { useRouter } from 'next/router';
import React from 'react';

const Watch = () => {
  const router = useRouter();
  const { id } = router.query;
  const { videos, fetchVideo, loading } = useVideo();

  const stringId = React.useMemo(() => (Array.isArray(id) ? id[0] : id), [id]);

  const video = React.useMemo(
    () => videos.find((v) => v._id === stringId),
    [videos, stringId],
  );

  // ✅ Fetch only if video not already in context
  React.useEffect(() => {
    if (stringId && !video) {
      fetchVideo(stringId);
    }
  }, [stringId, video, fetchVideo]);

  if (loading && !video) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading video...</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Video not found!</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main video area */}
        <div className="lg:col-span-2 space-y-4">
          <VideoPlayer video={video} />
          <VideoInfo video={video} />
          <VideoComments videoId={video._id} />
        </div>

        {/* Related videos sidebar */}
        <div className="space-y-4">
          <RelatedVideos videos={videos.filter((v) => v._id !== video._id)} />
        </div>
      </div>
    </div>
  );
};

export default Watch;
