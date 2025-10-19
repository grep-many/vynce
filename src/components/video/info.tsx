import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { ThumbsUp, Share, Clock } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import useLike from '@/hooks/useLike';
import useWatch from '@/hooks/useWatch';
import useChannel from '@/hooks/useChannel';
import { toast } from 'sonner';
import { formatViews, uploadTimeCal, extractInitials } from '@/lib';
import Link from 'next/link';

interface VideoInfoProps {
  video: any;
}

const VideoInfo: React.FC<VideoInfoProps> = ({ video }) => {
  const { user } = useAuth();
  const { reactVideo, isLikedVideo, videos } = useLike();
  const { toggleWatchLater } = useWatch();
  const {
    channel,
    fetchChannel,
    subscribedChannels,
    isChannelSubscribed,
    subscribe,
  } = useChannel();

  const [likes, setLikes] = React.useState(video.likes || 0);
  const [isLiked, setIsLiked] = React.useState(false);
  const [showFullDescription, setShowFullDescription] = React.useState(false);
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  // Fetch channel data when video changes
  React.useEffect(() => {
    if (video?.channel?._id) {
      fetchChannel(video.channel._id);
    }
  }, [video?.channel?._id]);

  // Update subscription state when channel or subscribedChannels change
  React.useEffect(() => {
    if (channel?._id) {
      setIsSubscribed(isChannelSubscribed(channel._id));
    }
  }, [channel, subscribedChannels]);

  // Update like state when video or liked videos change
  React.useEffect(() => {
    if (video?._id && videos.length > 0) {
      setIsLiked(isLikedVideo(video._id));
    }
    setLikes(video.likes || 0);
  }, [video?._id, videos]);

  const handleReaction = async (like: boolean) => {
    if (!user) {
      toast.warning('Signin to like the video!');
      return;
    }
    const { likes: updatedLikes } = await reactVideo(video._id, true);
    if (updatedLikes !== undefined) {
      setLikes(updatedLikes);
      setIsLiked(like);
    }
  };

  const handleWatchClick = async () => {
    await toggleWatchLater(video._id);
  };

  const handleSubscribe = async () => {
    if (!user) {
      toast.warning('Signin to subscribe!');
      return;
    }

    await subscribe(video?.channel?._id);
    // Sync with subscription context instead of toggling blindly
    setIsSubscribed(isChannelSubscribed(video?.channel?._id));
  };

  const truncatedDescription =
    video.description.length > 150
      ? video.description.slice(0, 150) + '...'
      : video.description;

  // If channel data is not loaded yet
  if (!channel) {
    return <div>Loading channel info...</div>;
  }

  const handleShare = async () => {
    const videoUrl = `${window.location.origin}/watch/${video._id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: `Check out this video: ${video.title}`,
          url: videoUrl,
        });
        toast.success('Video shared!');
      } catch (err) {
        console.error('Share failed', err);
        toast.error('Share cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(videoUrl);
        toast.success('Video link copied to clipboard!');
      } catch (err) {
        console.error('Copy failed', err);
        toast.error('Failed to copy link');
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <h1 className="text-xl font-semibold">{video.title}</h1>

      {/* Description */}
      <div className="text-sm text-muted-foreground">
        <p>{showFullDescription ? video.description : truncatedDescription}</p>
        {video.description.length > 150 && (
          <Button
            variant="outline"
            size="sm"
            className="mt-1 p-0 h-auto font-medium"
            onClick={() => setShowFullDescription(!showFullDescription)}
          >
            {showFullDescription ? 'Show less' : 'Show more'}
          </Button>
        )}
      </div>

      {/* Channel info */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={channel.image} alt={channel.name} />
            <AvatarFallback>
              {extractInitials(channel.name || 'C')}
            </AvatarFallback>
          </Avatar>
          <div>
            <Link
              href={`/channel/${channel._id}`}
              className="font-medium hover:text-foreground/70"
            >
              {channel.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              {formatViews(Number(channel.subscribers))} subscribers
            </p>
          </div>
        </div>

        <Button
          variant={isSubscribed ? 'secondary' : 'destructive'}
          onClick={handleSubscribe}
        >
          {isSubscribed ? 'Subscribed' : 'Subscribe'}
        </Button>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => handleReaction(!isLiked)} // toggle like/unlike
        >
          <ThumbsUp
            className={`w-5 h-5 ${isLiked ? 'fill-accent-foreground' : ''}`}
          />
          {likes.toLocaleString()}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={handleWatchClick}
        >
          <Clock className="w-5 h-5" />
          Watch Later
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={handleShare}
        >
          <Share className="w-5 h-5" />
          Share
        </Button>
      </div>

      {/* Views / Upload date */}
      <div className="text-sm text-muted-foreground flex gap-4">
        <span>{formatViews(video.views)} views</span>
        <span>{uploadTimeCal(video.createdAt)}</span>
      </div>
    </div>
  );
};

export default VideoInfo;
