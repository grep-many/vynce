import Link from 'next/link';
import React from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
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

type VideoCardProps = {
  video: any;
  type?: 'default' | 'related' | 'content';
  onRemove?: (id: string) => void;
};

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  type = 'default',
  onRemove,
}) => {
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

  // =========================================================
  // Related Videos
  // =========================================================
  if (type === 'related') {
    return (
      <Link
        // key={video?._id}
        href={`/watch/${video?._id}`}
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
            {video?.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{video?.channel}</p>
          <p className="text-xs text-muted-foreground">
            {formatViews(video?.views || 0)} views •{' '}
            {uploadTimeCal(video?.createdAt)}
          </p>
        </div>
      </Link>
    );
  }

  // =========================================================
  // History Videos (Updated layout to match SearchResult style + description)
  // =========================================================
  if (type === 'content') {
    return (
      <div
        // key={video?._id}
        className="flex gap-4 group rounded-lg p-2 hover:bg-secondary/20 transition-all"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Thumbnail */}
        <Link href={`/watch/${video?._id}`} className="flex-shrink-0">
          <div className="relative w-80 aspect-video rounded-lg overflow-hidden bg-muted">
            <VideoElement
              videoRef={videoRef}
              video={video}
              isPlaying={isPlaying}
            />
          </div>
        </Link>

        {/* Video Info */}
        <div className="flex-1 min-w-0 py-1">
          <Link href={`/watch/${video?._id}`}>
            <h3 className="font-medium text-lg line-clamp-2 group-hover:text-blue-600 mb-2">
              {video.title}
            </h3>
          </Link>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>{formatViews(video?.views || 0)} views</span>
            <span>•</span>
            <span>{uploadTimeCal(video?.createdAt)}</span>
          </div>

          <Link
            href={`/channel/${video?.channel}`}
            className="flex items-center gap-2 mb-2 hover:text-blue-600"
          >
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs">
                {extractInitials(video?.channel)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{video?.channel}</span>
          </Link>

          {/* ✅ Static Description (can be made dynamic later) */}
          <p className="text-sm text-muted-foreground line-clamp-2">{video.description}
          </p>

          {video?.watchedon && (
            <p className="text-xs text-muted-foreground mt-2">
              Watched {uploadTimeCal(video?.watchedon)}
            </p>
          )}
        </div>

        {/* Dropdown Menu */}
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
  // Default Video Card
  // =========================================================
  return (
    <Link href={`/watch/${video?._id}`}>
      <div
        className="w-full sm:max-w-sm cursor-pointer transition-transform duration-200 hover:scale-[1.02] hover:bg-secondary/20 p-2 rounded-md"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <VideoElement videoRef={videoRef} video={video} isPlaying={isPlaying} />
        <div className="flex mt-3 space-x-3">
          <div className="flex-shrink-0 w-10 h-10">
            <Avatar>
              <AvatarFallback>{extractInitials(video?.channel)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col overflow-hidden">
            <h3 className="text-sm font-semibold line-clamp-2">
              {video?.title.length > 20
                ? `${video?.title.slice(0, 20)}...`
                : video?.title}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {video?.channel}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatViews(video?.views || 0)} views •{' '}
              {uploadTimeCal(video?.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
