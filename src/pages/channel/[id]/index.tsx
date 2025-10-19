'use client';

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

const Channel: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const { isChannelSubscribed, channel, subscribedChannels, fetchChannel } =
    useChannel();

  const [subscribed, setSubscribed] = React.useState<boolean>(false);
  const [isDialogueOpen, setIsDialogueOpen] = React.useState(false);

  // Fetch channel data
  React.useEffect(() => {
    if (id) {
      fetchChannel(id as string);
    }
  }, [id]);

  // Update subscription state
  React.useEffect(() => {
    if (id && subscribedChannels.length > 0) {
      setSubscribed(isChannelSubscribed(id as string));
    }
  }, [id, subscribedChannels]);

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
        isOwner={id === user?.channel?._id}
        channel={channel}
        user={user}
        onEdit={user?.channel?._id === id ? openEditDialogue : undefined} // optional edit button
      />

      {/* Channel Edit Dialogue */}
      {user?.channel?._id === id && (
        <ChannelDialogue
          isopen={isDialogueOpen}
          onclose={closeEditDialogue}
          channeldata={channel}
          mode="edit"
        />
      )}

      <ChannelTabs />

      {/* Video Uploader */}
      {id === user?.channel?._id && (
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
