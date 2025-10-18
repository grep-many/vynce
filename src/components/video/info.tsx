import React from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { extractInitials, formatViews, uploadTimeCal } from '@/lib';
import { Button } from '../ui/button';
import {
  Clock,
  Download,
  MoreHorizontal,
  Share,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { toast } from 'sonner';
import useLike from '@/hooks/useLike';

const VideoInfo = ({ video }: any) => {
  const { user } = useAuth();
  const { reactVideo } = useLike();

  const [likes, setLikes] = React.useState(video.likes || 0);
  const [dislikes, setDislikes] = React.useState(video.dislikes || 0);
  const [isLiked, setIsLiked] = React.useState(false);
  const [isDisliked, setIsDisliked] = React.useState(false);
  const [showFullDescription, setShowFullDescription] = React.useState(false);

  // Initialize state
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
    }

    try {
      const { likes, dislikes } = await reactVideo(video._id, like); // call backend
      setLikes(likes);
      setDislikes(dislikes);

      setIsLiked(like ? !isLiked : false);
      setIsDisliked(!like ? !isDisliked : false);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{video.title}</h1>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-10 h-10">
            <AvatarFallback>{extractInitials(video.channel)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{video.channel}</h3>
            <p className="text-sm text-gray-600">1.2M subscribers</p>
          </div>
          <Button className="ml-4">Subscribe</Button>
        </div>

        {/* Like / Dislike */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-full">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-l-full"
              onClick={() => handleReaction(true)}
            >
              <ThumbsUp
                className={`w-5 h-5 mr-2 ${
                  isLiked ? 'fill-accent-foreground' : ''
                }`}
              />
              {likes.toLocaleString()}
            </Button>

            <div className="w-px h-6" />

            <Button
              variant="ghost"
              size="sm"
              className="rounded-r-full"
              onClick={() => handleReaction(false)}
            >
              <ThumbsDown
                className={`w-5 h-5 mr-2 ${
                  isDisliked ? 'fill-accent-foreground' : ''
                }`}
              />
              {dislikes.toLocaleString()}
            </Button>
          </div>

          <Button variant="ghost" size="sm" className="rounded-full">
            <Share className="w-5 h-5 mr-2" />
            Share
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            <Download className="w-5 h-5 mr-2" />
            Download
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-lg p-4">
        <div className="flex gap-4 text-sm font-medium mb-2">
          <span>{formatViews(video.views)} views</span>
          <span>{uploadTimeCal(video.createdAt)}</span>
        </div>
        <div className={`text-sm ${showFullDescription ? '' : 'line-clamp-3'}`}>
          <p>{video.description}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 p-0 h-auto font-medium"
          onClick={() => setShowFullDescription(!showFullDescription)}
        >
          {showFullDescription ? 'Show less' : 'Show more'}
        </Button>
      </div>
    </div>
  );
};

export default VideoInfo;
