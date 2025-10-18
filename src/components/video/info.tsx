import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { ThumbsUp, ThumbsDown, Share, Clock } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import useLike from '@/hooks/useLike';
import { toast } from 'sonner';
import { formatViews, uploadTimeCal, extractInitials } from '@/lib';
import useWatch from '@/hooks/useWatch';
import Link from 'next/link';
import useChannel from '@/hooks/useChannel';

const VideoInfo = ({ video }: any) => {
  const { user } = useAuth();
  const { reactVideo } = useLike();
  const { toggleWatchLater } = useWatch();
  const { channel, fetchChannel, subscribe } = useChannel();

  const [likes, setLikes] = React.useState(video.likes || 0);
  const [dislikes, setDislikes] = React.useState(video.dislikes || 0);
  const [isLiked, setIsLiked] = React.useState(false);
  const [isDisliked, setIsDisliked] = React.useState(false);
  const [showFullDescription, setShowFullDescription] = React.useState(false);

  // ✅ subscription state
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  React.useEffect(() => {
    setLikes(video.likes || 0);
    setDislikes(video.dislikes || 0);

    if (user) {
      setIsLiked(video.likesArray?.includes(user._id) || false);
      setIsDisliked(video.dislikesArray?.includes(user._id) || false);
    }
  }, [video, user]);

  // Fetch channel info and check subscription
  React.useEffect(() => {
    if (video?.channel?._id) {
      fetchChannel(video.channel._id).then(() => {
        // Check if the current user is subscribed
        if (user && channel) {
          setIsSubscribed(channel.subscribed || false);
        }
      });
    }
  }, [video?.channel?._id, user]);

  const handleReaction = async (like: boolean) => {
    if (!user) {
      toast.warning('Signin to like the video!');
      return;
    }
    const { likes, dislikes } = await reactVideo(video._id, like);
    setLikes(likes);
    setDislikes(dislikes);
    setIsLiked(like ? !isLiked : false);
    setIsDisliked(!like ? !isDisliked : false);
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
    setIsSubscribed(!isSubscribed); // toggle local state
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
            variant="ghost"
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
            {channel?.image ? (
              <AvatarImage src={channel?.image} alt={channel?.name} />
            ) : (
              <AvatarFallback>
                {extractInitials(channel?.name || 'C')}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <Link
              href={`/channel/${channel?._id}`}
              className="font-medium hover:text-blue-600"
            >
              {channel?.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              {formatViews(Number(channel?.subscribers))} subscribers
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
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => handleReaction(true)}
        >
          <ThumbsUp
            className={`w-5 h-5 ${isLiked ? 'fill-accent-foreground' : ''}`}
          />
          {likes.toLocaleString()}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => handleReaction(false)}
        >
          <ThumbsDown
            className={`w-5 h-5 ${isDisliked ? 'fill-accent-foreground' : ''}`}
          />
          {dislikes.toLocaleString()}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => handleWatchClick()}
        >
          <Clock className="w-5 h-5" />
          Watch Later
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
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