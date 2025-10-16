import React from 'react'
import VideoCard from './card'

const RelatedVideos = ({videos}:any) => {
  return (
    <div className="space-y-2">
      {videos.map((video: any) => (
        <VideoCard video={video} type={"related"}/>
      ))}
    </div>
  );
}

export default RelatedVideos
