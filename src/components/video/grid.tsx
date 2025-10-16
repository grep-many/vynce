import React from 'react';
import VideoCard from './card';

const VideoGrid = () => {
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
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
};

export default VideoGrid;
