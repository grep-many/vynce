import React from 'react';
import { useRouter } from 'next/router';
import VideoComments from '@/components/video/comments';
import VideoInfo from '@/components/video/info';
import VideoPlayer from '@/components/video/player';
import RelatedVideos from '@/components/video/related';
import useAuth from '@/hooks/useAuth';
import useHistory from '@/hooks/useHistory';
import NotFound from '@/components/not-found';
import { GetServerSideProps } from 'next';
import { getVideo, getVideos } from '@/services/video.service';

interface Props{
  video: any,
  related:[any]
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  if (!id || Array.isArray(id)) {
    return { notFound: true };
  }

  try {
    const { video } = await getVideo(id);
    const { videos } = await getVideos({});
    return {
      props: {
        video: video,
        related:videos
      },
    };
  } catch (err) {
    return {
      props: {
        video: null,
        related: [],
      },
    };
  }
};

const Watch: React.FC<Props> = ({video,related}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { addVideoToHistory } = useHistory();

  React.useEffect(() => {
    if (user&&video) {
      addVideoToHistory(video?._id)
    }
  },[user,video])

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
          {/* {typeof id === 'string' && <VideoComments videoId={video?._id} />} */}
          <VideoComments videoId={video?._id} />
        </div>

        {/* Related videos sidebar */}
        <div className="space-y-4">
          <RelatedVideos videos={related.filter((v) => v._id !== video._id)} />
        </div>
      </div>
    </div>
  );
};

export default Watch;
