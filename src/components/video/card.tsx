import Link from 'next/link';
import React from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { extractInitials, formatViews, uploadTimeCal } from '../../../libs';
import VideoElement from './video-element';

const VideoCard = ({ video, type = 'default' }: any) => {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  if (type === 'related') {
    return (
      <Link
        key={video._id}
        href={`/watch/${video._id}`}
        className="flex gap-2 group hover:bg-secondary rounded-lg p-1"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-40 flex-shrink-0">
          <VideoElement
            videoRef={videoRef}
            video={video}
            isPlaying={isPlaying}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600">
            {video.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{video.channel}</p>
          <p className="text-xs text-muted-foreground">
            {formatViews(video.views || 0)} views •{' '}
            {uploadTimeCal(video.createdAt)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/watch/${video._id}`}>
      <div
        className="w-full sm:max-w-sm cursor-pointer transition-transform duration-200 hover:scale-[1.02] hover:bg-secondary/20 p-2 rounded-md"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <VideoElement videoRef={videoRef} video={video} isPlaying={isPlaying} />
        <div className="flex mt-3 space-x-3">
          <div className="flex-shrink-0 w-10 h-10">
            <Avatar>
              <AvatarFallback>{extractInitials(video.channel)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col overflow-hidden">
            <h3 className="text-sm font-semibold line-clamp-2">
              {video.title.length > 20
                ? `${video.title.slice(0, 20)}...`
                : video.title}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {video.channel}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatViews(video.views || 0)} views •{' '}
              {uploadTimeCal(video.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
