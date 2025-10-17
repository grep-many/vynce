const VideoElement = ({ videoRef, video, isPlaying }: any) => (
  <div className="relative w-full aspect-video rounded-md overflow-hidden bg-black">
    <video
      ref={videoRef}
      src={video.filepath}
      muted
      loop
      playsInline
      className="object-cover w-full h-full"
    />
    {!isPlaying && (
      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 rounded">
        {video.duration || '10:24'}
      </div>
    )}
  </div>
);

export default VideoElement;
