import VideoPlayer from '@/components/video/player';
import { useRouter } from 'next/router';
import React from 'react';

const Video = () => {
  const router = useRouter();
  const { id } = router.query;

  // TODO : remove this static object
  const relatedVideos = [
    {
      _id: '1',
      title: 'Amazing Nature Documentary',
      filename: 'nature-doc.mp4',
      filetype: 'video/mp4',
      filepath: '/vdo.mp4',
      filesize: '500MB',
      channel: 'Nature Channel',
      like: 1250,
      dislike: 50,
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
      like: 890,
      dislike: 20,
      views: 23000,
      uploader: 'chef_master',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  const video: any = React.useMemo(() => {
    const stringId = Array.isArray(id) ? id[0] : id;
    return relatedVideos.find((video) => video._id === stringId);
  }, [id]);

  if (!video) {
    return <div className=" flex items-center justify-center">Not Found!</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <VideoPlayer video={video} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
