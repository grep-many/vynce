import { useEffect, useState } from 'react';

const VideoElement = ({ videoRef, video, isPlaying }: any) => {
  const [duration, setDuration] = useState<string>(''); // store formatted duration

  useEffect(() => {
    if (!videoRef.current) return;

    const handleLoadedMetadata = () => {
      const seconds = videoRef.current.duration;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      setDuration(
        `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`,
      );
    };

    const videoEl = videoRef.current;
    videoEl.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      videoEl.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoRef]);

  return (
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
          {duration || '00:00'}
        </div>
      )}
    </div>
  );
};

export default VideoElement;
