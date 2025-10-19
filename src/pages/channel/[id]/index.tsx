import ChannelHeader from '@/components/channel/header';
import ChannelTabs from '@/components/channel/tabs';
import ChannelVideos from '@/components/channel/videos';
import VideoUploader from '@/components/video/uploader';
import useAuth from '@/hooks/useAuth';
import useChannel from '@/hooks/useChannel';
import { useRouter } from 'next/router';
import React from 'react';

const Channel = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
const { isChannelSubscribed, channel,subscribedChannels, fetchChannel } = useChannel();

  const [subscribed, setSubscribed] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      fetchChannel(id as string);
    }
  }, [id]);

  React.useEffect(() => {
    if (id && subscribedChannels.length > 0) {
      setSubscribed(isChannelSubscribed(id as string));
    }
  }, [id, subscribedChannels]);

  // channel=null
  if (!channel) {
    return <div>Not Found</div>;
  }
  return (
    <>
      <div className="max-w-full mx-auto">
        <ChannelHeader subscribed={subscribed} channel={channel} user={user} />
        <ChannelTabs />
        <div className="p-4 pb-8">
          <VideoUploader channelId={id} channelName={channel?.name} />
        </div>
        <div className="px-4 pb-8">
          <ChannelVideos videos={channel.videos} />
        </div>
      </div>
    </>
  );
};

export default Channel;
