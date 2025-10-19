import React from 'react';
import { useRouter } from 'next/router';
import ChannelHeader from '@/components/channel/header';
import ChannelTabs from '@/components/channel/tabs';
import ChannelVideos from '@/components/channel/videos';
import VideoUploader from '@/components/video/uploader';
import ChannelDialogue from '@/components/channel/dialog';
import useAuth from '@/hooks/useAuth';
import useChannel from '@/hooks/useChannel';
import NotFound from '@/components/not-found';
import Loading from '@/components/loading';

const Channel: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const {
    isChannelSubscribed,
    loading,
    channel,
    subscribedChannels,
    fetchChannel,
  } = useChannel();

  const [subscribed, setSubscribed] = React.useState<boolean>(false);
  const [isDialogueOpen, setIsDialogueOpen] = React.useState(false);

  const isOwner = id === user?.channel?._id;

  // Fetch channel data
  React.useEffect(() => {
    if (id) fetchChannel(id as string);
  }, [id]);

  // Update subscription state safely
  React.useEffect(() => {
    if (!id) return;

    const subscribedState = isChannelSubscribed(id as string);
    setSubscribed((prev) =>
      prev !== subscribedState ? subscribedState : prev,
    );
  }, [id, subscribedChannels]);

  if (loading) return <Loading />;

  // Channel not found
  if (!channel) {
    return (
      <NotFound
        message="Channel not found!"
        button={{
          text: 'Explore Videos',
          onClick: () => router.push('/'),
        }}
      />
    );
  }

  const openEditDialogue = () => setIsDialogueOpen(true);
  const closeEditDialogue = () => setIsDialogueOpen(false);

  return (
    <div className="max-w-full mx-auto">
      {/* Channel Header */}
      <ChannelHeader
        subscribed={subscribed}
        isOwner={isOwner}
        channel={channel}
        user={user}
        onEdit={isOwner ? openEditDialogue : undefined}
      />

      {/* Channel Edit Dialogue */}
      {isOwner && (
        <ChannelDialogue
          isopen={isDialogueOpen}
          onclose={closeEditDialogue}
          channeldata={channel}
          mode="edit"
        />
      )}

      <ChannelTabs />

      {/* Video Uploader */}
      {isOwner && (
        <div className="p-4 pb-8">
          <VideoUploader channelId={id as string} channelName={channel.name} />
        </div>
      )}

      {/* Channel Videos */}
      <div className="p-4 pb-8">
        <ChannelVideos videos={channel.videos} />
      </div>
    </div>
  );
};

export default Channel;