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
import NotFound from '../not-found';

interface VideoInfoProps {
  video: any;
}

const VideoInfo: React.FC<VideoInfoProps> = ({ video }) => {
  const { user } = useAuth();
  const { reactVideo, isLikedVideo, likedVideos, fetchLikedVideos } = useLike();
  const { toggleWatchLater } = useWatch();
  const {
    channel,
    fetchChannel,
    isChannelSubscribed,
    subscribe,
    subscribedChannels,
    fetchSubscribedChannels,
  } = useChannel();

  const [likes, setLikes] = React.useState(video.likes || 0);
  const [showFullDescription, setShowFullDescription] = React.useState(false);
  const [liked, setLiked] = React.useState(false);
  const [subscribed, setSubscribed] = React.useState(false);

  // 🟢 Fetch channel + ensure subscriptions are loaded
  React.useEffect(() => {
    if (video?.channel?._id) {
      fetchChannel(video.channel._id);
    }
    if (user) {
      fetchSubscribedChannels();
      fetchLikedVideos();
    }
  }, [video?.channel?._id, user]);

  // 🟢 Sync liked state
  React.useEffect(() => {
    if (!video?._id) return;
    const likedState = isLikedVideo(video._id);
    setLiked((prev) => (prev !== likedState ? likedState : prev));
  }, [video?._id, likedVideos, user]);

  // 🟢 Sync subscribed state
  React.useEffect(() => {
    if (!video?.channel?._id) return;
    const subscribedState = isChannelSubscribed(video.channel._id);
    setSubscribed((prev) =>
      prev !== subscribedState ? subscribedState : prev,
    );
  }, [video?.channel?._id, subscribedChannels, user]);

  if (!channel) {
    return <NotFound message="Channel not found!" />;
  }

  // 🟢 Handlers
  const handleReaction = async (like: boolean) => {
    if (!user) return toast.warning('Signin to like the video!');
    const { likes: updatedLikes } = await reactVideo(video._id, like);
    if (updatedLikes !== undefined) {
      setLikes(updatedLikes);
      setLiked(like);
    }
  };

  const handleWatchClick = async () => {
    await toggleWatchLater(video._id);
  };

  const handleSubscribe = async () => {
    if (!user) return toast.warning('Signin to subscribe!');
    await subscribe(video.channel._id);
    // toggle locally for instant UI feedback
    setSubscribed((prev) => !prev);
  };

  const handleShare = async () => {
    const videoUrl = `${window.location.origin}/watch/${video._id}`;
    if (navigator.share) {
      await navigator.share({
        title: video.title,
        text: `Check out this video: ${video.title}`,
        url: videoUrl,
      });
    } else {
      try {
        await navigator.clipboard.writeText(videoUrl);
        toast.success('Video link copied to clipboard!');
      } catch {
        toast.error('Failed to copy link');
      }
    }
  };

  const truncatedDescription =
    video.description.length > 150
      ? video.description.slice(0, 150) + '...'
      : video.description;

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

      {/* Channel Info */}
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
          variant={subscribed ? 'secondary' : 'destructive'}
          onClick={handleSubscribe}
        >
          {subscribed ? 'Subscribed' : 'Subscribe'}
        </Button>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => handleReaction(!liked)}
        >
          <ThumbsUp
            className={`w-5 h-5 ${liked ? 'fill-accent-foreground' : ''}`}
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