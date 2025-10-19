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
import { Card, CardContent, CardTitle, CardDescription } from '../ui/card';

type VideoType = 'default' | 'related' | 'content';

interface ChannelInfo {
  _id: string;
  name: string;
  image?: string;
}

interface VideoCardProps {
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

  // Handle channel object vs string
  const channel =
    typeof video.channel === 'object'
      ? video.channel
      : { _id: '', name: video.channel || 'Unknown Channel' };

  const channelName = channel.name;
  const channelId = channel._id;
  const initials = extractInitials(channelName);
  const viewsText = formatViews(video?.views ?? 0);

  // Fix: Convert Date to string for uploadTimeCal
  const uploadTime = uploadTimeCal(
    video.createdAt instanceof Date
      ? video.createdAt.toISOString()
      : video.createdAt,
  );

  const watchedTime = video.watchedon
    ? uploadTimeCal(
        video.watchedon instanceof Date
          ? video.watchedon.toISOString()
          : video.watchedon,
      )
    : null;

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

  // Three-dot menu
  const renderMenu = () =>
    onRemove ? (
      <div className="absolute top-2 right-2 z-10 bg-muted/70 rounded">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 p-1 hover:bg-secondary/30"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onRemove(video._id)}>
              <X className="w-4 h-4 mr-2" /> Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ) : null;

  // RELATED CARD
  if (type === 'related') {
    return (
      <Link
        href={`/watch/${video._id}`}
        className="block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative group">
          {renderMenu()}
          <Card className="flex flex-row gap-3 items-start p-2 hover:bg-secondary/20 transition-colors rounded-lg">
            <div className="w-36 sm:w-40 flex-shrink-0 aspect-video relative rounded-md overflow-hidden bg-muted">
              <VideoElement
                videoRef={videoRef}
                video={video}
                isPlaying={isPlaying}
              />
            </div>
            <CardContent className="flex-1 min-w-0 p-0">
              <CardTitle className="text-sm font-semibold line-clamp-2 group-hover:text-foreground/70">
                {video.title}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {channelName}
              </CardDescription>
              <p className="text-xs text-muted-foreground mt-1">
                {viewsText} views • {uploadTime}
              </p>
              <CardDescription className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {video.description}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </Link>
    );
  }

  // CONTENT CARD
  if (type === 'content') {
    return (
      <div
        className="relative group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {renderMenu()}
        <Card className="flex flex-col md:flex-row gap-4 p-2 hover:bg-secondary/20 transition-all rounded-lg">
          <Link
            href={`/watch/${video._id}`}
            className="flex-shrink-0 w-full md:w-80 aspect-video relative rounded-lg overflow-hidden bg-muted"
          >
            <VideoElement
              videoRef={videoRef}
              video={video}
              isPlaying={isPlaying}
            />
          </Link>

          <CardContent className="flex-1 min-w-0 py-1">
            <Link href={`/watch/${video._id}`}>
              <CardTitle className="text-lg line-clamp-2 group-hover:text-foreground/70 mb-2">
                {video.title}
              </CardTitle>
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
                <AvatarImage src={channel.image} alt={channel.name} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{channelName}</span>
            </Link>

            <CardDescription className="text-sm text-muted-foreground line-clamp-2">
              {video.description}
            </CardDescription>

            {watchedTime && (
              <p className="text-xs text-muted-foreground mt-2">
                Watched {watchedTime}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // DEFAULT CARD
  return (
    <Link
      href={`/watch/${video._id}`}
      className="block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative group">
        {renderMenu()}
        <Card className="w-full sm:max-w-sm cursor-pointer transition-transform duration-200 hover:scale-[1.02] hover:bg-secondary/20 p-2 rounded-md">
          <VideoElement
            videoRef={videoRef}
            video={video}
            isPlaying={isPlaying}
          />
          <CardContent className="flex mt-3 space-x-3 p-0">
            <Avatar className="flex-shrink-0 w-10 h-10">
              <AvatarImage src={channel.image} alt={channel.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <CardTitle className="text-sm font-semibold line-clamp-2">
                {video.title.length > 20
                  ? `${video.title.slice(0, 20)}...`
                  : video.title}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground truncate">
                {channelName}
              </CardDescription>
              <p className="text-xs text-muted-foreground">
                {viewsText} views • {uploadTime}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
};

export default VideoCard;
