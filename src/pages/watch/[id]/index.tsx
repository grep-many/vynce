'use client';

import React from 'react';
import { useRouter } from 'next/router';
import VideoComments from '@/components/video/comments';
import VideoInfo from '@/components/video/info';
import VideoPlayer from '@/components/video/player';
import RelatedVideos from '@/components/video/related';
import useAuth from '@/hooks/useAuth';
import useHistory from '@/hooks/useHistory';
import useVideo from '@/hooks/useVideo';
import NotFound from '@/components/not-found';
import Loading from '@/components/loading';

const Watch: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const videoId = Array.isArray(id) ? id[0] : id; 
  const { user } = useAuth();
  const { videos, fetchVideo, loading } = useVideo();
  const { addVideoToHistory } = useHistory();

  const video = React.useMemo(
    () => videos.find((v) => v._id === videoId),
    [videos, videoId],
  );

  React.useEffect(() => {
    if (videoId && !video) {
      fetchVideo(videoId);
    }
    if (user && videoId) addVideoToHistory(videoId);
  }, [videoId, video, user]);

  // Loading state
  if (loading && !video) {
    return <Loading />;
  }

  // Video not found
  if (!video || !videoId) {
    return (
      <NotFound
        message="Video not found!"
        button={{
          text: 'Explore Videos',
          onClick: () => router.push('/'),
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main video area */}
        <div className="lg:col-span-2 space-y-4">
          <VideoPlayer video={video} />
          <VideoInfo video={video} />
          {typeof id === 'string' && <VideoComments videoId={videoId} />}
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
