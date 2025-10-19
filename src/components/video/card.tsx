import Link from 'next/link';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { extractInitials, formatViews, uploadTimeCal } from '@/lib';
import VideoElement from './video-element';
import { Button } from '../ui/button';
import { MoreVertical, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export type VideoType = 'default' | 'related' | 'content';

interface ChannelInfo {
  _id: string;
  name: string;
  image?: string;
}

export interface VideoCardProps {
  video: {
    _id: string;
    title: string;
    description: string;
    channel: string | ChannelInfo;
    views?: number;
    createdAt: string | Date;
    watchedon?: string | Date;
  };
  type?: VideoType;
  onRemove?: (id: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  type = 'default',
  onRemove,
}) => {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  // --- Normalize channel data ---
  const channel =
    typeof video.channel === 'object'
      ? video.channel
      : { _id: '', name: video.channel || 'Unknown Channel' };

  const channelName = channel?.name;
  const channelId = channel._id;
  const initials = extractInitials(channelName);

  // --- Format other data ---
  const viewsText = formatViews(video?.views || 0);
  const uploadTime = uploadTimeCal(video?.createdAt);
  const watchedTime = video?.watchedon ? uploadTimeCal(video?.watchedon) : null;

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

  // =========================================================
  // RELATED VIDEOS
  // =========================================================
  if (type === 'related') {
    return (
      <Link
        href={`/watch/${video?._id}`}
        className="flex gap-2 group hover:bg-secondary rounded-lg p-1 transition-colors"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-36 sm:w-40 flex-shrink-0">
          <VideoElement
            videoRef={videoRef}
            video={video}
            isPlaying={isPlaying}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600">
            {video?.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{channelName}</p>
          <p className="text-xs text-muted-foreground">
            {viewsText} views • {uploadTime}
          </p>
        </div>
      </Link>
    );
  }

  // =========================================================
  // CONTENT / HISTORY VIDEOS
  // =========================================================
  if (type === 'content') {
    return (
      <div
        className="flex flex-col lg:flex-row gap-4 group rounded-lg p-2 hover:bg-secondary/20 transition-all"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Thumbnail */}
        <Link
          href={`/watch/${video?._id}`}
          className="flex-shrink-0 w-full md:w-80 aspect-video relative rounded-lg overflow-hidden bg-muted"
        >
          <VideoElement
            videoRef={videoRef}
            video={video}
            isPlaying={isPlaying}
          />
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0 py-1">
          <Link href={`/watch/${video?._id}`}>
            <h3 className="font-medium text-lg line-clamp-2 group-hover:text-blue-600 mb-2">
              {video?.title}
            </h3>
          </Link>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 flex-wrap">
            <span>{viewsText} views</span>
            <span>•</span>
            <span>{uploadTime}</span>
          </div>

          <Link
            href={`/channel/${channelId}`}
            className="flex items-center gap-2 mb-2 hover:text-foreground/90"
          >
            <Avatar className="w-6 h-6">
              <AvatarImage src={channel?.image} alt={channel?.name} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{channelName}</span>
          </Link>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {video?.description}
          </p>

          {watchedTime && (
            <p className="text-xs text-muted-foreground mt-2">
              Watched {watchedTime}
            </p>
          )}
        </div>

        {/* Dropdown */}
        {onRemove && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onRemove(video?._id)}>
                <X className="w-4 h-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    );
  }

  // =========================================================
  // DEFAULT VIDEO CARD
  // =========================================================
  return (
    <Link href={`/watch/${video?._id}`}>
      <div
        className=" w-full sm:max-w-sm cursor-pointer transition-transform duration-200 hover:scale-[1.02] hover:bg-secondary/20 p-2 rounded-md"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <VideoElement videoRef={videoRef} video={video} isPlaying={isPlaying} />
        <div className="flex mt-3 space-x-3">
          <div className="flex-shrink-0 w-10 h-10">
            <Avatar>
              <AvatarImage src={channel?.image} alt={channel?.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col overflow-hidden">
            <h3 className="text-sm font-semibold line-clamp-2">
              {video?.title.length > 20
                ? `${video?.title.slice(0, 20)}...`
                : video?.title}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {channelName}
            </p>
            <p className="text-xs text-muted-foreground">
              {viewsText} views • {uploadTime}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
