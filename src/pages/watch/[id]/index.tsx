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
  const { user } = useAuth();
  const { videos, fetchVideo, loading } = useVideo();
  const { addVideoToHistory } = useHistory();

  const stringId = React.useMemo(() => (Array.isArray(id) ? id[0] : id), [id]);

  const video = React.useMemo(
    () => videos.find((v) => v._id === stringId),
    [videos, stringId],
  );

  React.useEffect(() => {
    if (stringId && !video) {
      fetchVideo(stringId);
    }
    if (user && stringId) addVideoToHistory(stringId);
  }, [stringId, video, user]);

  // Loading state
  if (loading && !video) {
    return <Loading />;
  }

  // Video not found
  if (!video) {
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
          <VideoComments videoId={stringId} />
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
