import React from 'react';

const VideoPlayer = ({ video }: any) => {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  return (
    <div className="aspect-video rounded-lg overflow-hidden">
      <video ref={videoRef} className='w-full h-full' controls>
        <source src={video.filepath} type='video/mp4'/>
        Your Browser does not support video tag
      </video>
    </div>
  );
};

export default VideoPlayer;
