import Link from 'next/link';
import React from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';

// TODO: type suff
// interface Video {
//   _id: string;
//   title: string;
//   filename: string;
//   filetype: string;
//   filepath: string;
//   filesize: string;
//   channel: string;
//   Like?: number;
//   views?: number;
//   uploader?: string;
//   createdAt?: string;
//   duration?: string;
// }

// interface VideoCardProps {
//   video: Video;
// }

// const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
const VideoCard = ({ video }: any) => {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const formatNumber = (num: number) =>
    num >= 1_000_000_000_000
      ? (num / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 'T'
      : num >= 1_000_000_000
      ? (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B'
      : num >= 1_000_000
      ? (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
      : num >= 1_000
      ? (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
      : num.toString();

  const timeAgo = (dateString?: string) => {
    if (!dateString) return '';
    const seconds = Math.floor(
      (new Date().getTime() - new Date(dateString).getTime()) / 1000,
    );
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
    ];
    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1)
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
    return 'Just now';
  };

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

  return (
    <Link href={`/watch/${video._id}`}>
      <div
        className="w-full sm:max-w-sm cursor-pointer transition-transform duration-200 hover:scale-[1.02] hover:bg-secondary/20 p-2 rounded-md"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Video Thumbnail / Preview */}
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
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {video.duration || '10:24'}
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="flex mt-3 space-x-3">
          {/* Channel Avatar */}
          <div className="flex-shrink-0 w-10 h-10">
            <Avatar>
              <AvatarFallback>
                {video.channel
                  .trim()
                  .split(' ')
                  .filter(Boolean)
                  .map((w: string) => w[0]?.toUpperCase())
                  .slice(0, 2)
                  .join('')}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Video Details */}
          <div className="flex flex-col overflow-hidden">
            <h3 className="text-sm font-semibold line-clamp-2">
              {video.title.length > 20
                ? video.title.slice(0, 20) + '...'
                : video.title}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {video.channel}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatNumber(video.views || 0)} views •{' '}
              {timeAgo(video.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
