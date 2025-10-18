import React from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  ThumbsUp,
  ThumbsDown,
  Share,
  Clock,
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import useLike from '@/hooks/useLike';
import { toast } from 'sonner';
import { formatViews, uploadTimeCal, extractInitials } from '@/lib';
import useWatch from '@/hooks/useWatch';

const VideoInfo = ({ video }: any) => {
  const { user } = useAuth();
  const { reactVideo } = useLike();
  const { toggleWatchLater } = useWatch();

  const [likes, setLikes] = React.useState(video.likes || 0);
  const [dislikes, setDislikes] = React.useState(video.dislikes || 0);
  const [isLiked, setIsLiked] = React.useState(false);
  const [isDisliked, setIsDisliked] = React.useState(false);
  const [showFullDescription, setShowFullDescription] = React.useState(false);

  React.useEffect(() => {
    setLikes(video.likes || 0);
    setDislikes(video.dislikes || 0);
    if (user) {
      setIsLiked(video.likesArray?.includes(user._id) || false);
      setIsDisliked(video.dislikesArray?.includes(user._id) || false);
    }
  }, [video, user]);

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

  // Truncated description logic
  const truncatedDescription =
    video.description.length > 150
      ? video.description.slice(0, 150) + '...'
      : video.description;

  return (
    <div className="space-y-4">
      {/* Title */}
      <h1 className="text-xl font-semibold">{video.title}</h1>

      {/* Description */}
      <div className="text-sm text-gray-700">
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
            <AvatarFallback>{extractInitials(video.channel)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{video.channel}</h3>
            <p className="text-sm text-gray-600">1.2M subscribers</p>
          </div>
        </div>
        <Button variant="destructive">Subscribe</Button>
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
      <div className="text-sm text-gray-600 flex gap-4">
        <span>{formatViews(video.views)} views</span>
        <span>{uploadTimeCal(video.createdAt)}</span>
      </div>
    </div>
  );
};

export default VideoInfo;
