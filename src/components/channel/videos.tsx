import React from 'react';
import VideoCard from '../video/card';
import NotFound from '../not-found';

interface ChannelInfo {
  _id: string;
  name: string;
  image?: string;
}

interface Video {
  _id: string;
  title: string;
  description: string; // <-- remove the question mark
  thumbnailUrl: string;
  videoUrl: string;
  channel: string | ChannelInfo;
  duration?: number;
  views?: number;
  createdAt: string | Date; // <-- make required to match VideoCard too
  updatedAt?: string;
  channelId?: string;
  watchedon?: string | Date; // <-- add this to match VideoCard props
}

interface ChannelVideosProps {
  videos: Video[];
}

const ChannelVideos: React.FC<ChannelVideosProps> = ({ videos }) => {
  if (videos.length === 0) {
    return <NotFound message="No videos uploaded yet." />;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos.map((video) => (
          <VideoCard key={video._id.toString()} video={video} />
        ))}
      </div>
    </div>
  );
};

export default ChannelVideos;
