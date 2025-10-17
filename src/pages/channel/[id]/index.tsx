import ChannelHeader from '@/components/channel/header';
import ChannelTabs from '@/components/channel/tabs';
import ChannelVideos from '@/components/channel/videos';
import VideoUploader from '@/components/video/uploader';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import React from 'react';

const Channel = () => {
  const router = useRouter();
  const { id } = router.query;
  const {user} = useAuth()
  // TODO: remove below static videos object
  const videos = [
    {
      _id: '1',
      title: 'Amazing Nature Documentary',
      filename: 'nature-doc.mp4',
      filetype: 'video/mp4',
      filepath: '/vdo.mp4',
      filesize: '500MB',
      channel: 'Nature Channel',
      like: 1250,
      views: 45000,
      uploader: 'nature_lover',
      createdAt: new Date().toISOString(),
    },
    {
      _id: '2',
      title: 'Cooking Tutorial: Perfect Pasta',
      filename: 'pasta-tutorial.mp4',
      filetype: 'video/mp4',
      filepath: '/vdo.mp4',
      filesize: '300MB',
      channel: "Chef's Kitchen",
      Like: 890,
      views: 23000,
      uploader: 'chef_master',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
  // let channel = null
  let channel = {
    id: id,
    name: 'Tech Channel',
    email: 'tech@example.com',
    description:
      'Welcome to our channel! We cover the latest in technology , reviews and tutorials',
    joinedOn: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
  };
  // channel=null
  if (!channel) {
    return <div>Not Found</div>;
  }
  return (
    <>
      <div className="max-w-full mx-auto">
        <ChannelHeader channel={channel} user={user} />
        <ChannelTabs />
        <div className="p-4 pb-8">
          <VideoUploader channelId={id} channelName={channel?.name} />
        </div>
        <div className="px-4 pb-8">
          <ChannelVideos videos={videos} />
        </div>
      </div>
    </>
  );
};

export default Channel;
