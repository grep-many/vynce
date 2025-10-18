import { useEffect, useState } from 'react';

const VideoElement = ({ videoRef, video, isPlaying }: any) => {
  const [duration, setDuration] = useState<string>(''); // store formatted duration

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const formatDuration = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${
        remainingSeconds < 10 ? '0' : ''
      }${remainingSeconds}`;
    };

    const handleLoadedMetadata = () => {
      if (videoEl.duration && !isNaN(videoEl.duration)) {
        setDuration(formatDuration(videoEl.duration));
      }
    };

    // Attach event listener
    videoEl.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Immediately check if metadata already loaded (cached video)
    if (videoEl.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      videoEl.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoRef]);

  return (
    <div className="relative w-full aspect-video rounded-md overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={video?.filepath}
        muted
        loop
        playsInline
        className="object-cover w-full h-full"
      />
      {!isPlaying && duration && (
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 rounded">
          {duration}
        </div>
      )}
    </div>
  );
};

export default VideoElement;
