import React from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { extractInitials, formatViews, uploadTimeCal } from '../../../libs';
import { Button } from '../ui/button';
import {
  Clock,
  Download,
  MoreHorizontal,
  Share,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';

const VideoInfo = ({ video }: any) => {
  //TODO: refactor state management looks messy this way use object
  const [like, setLikes] = React.useState(video.like | 0);
  const [dislike, setDislikes] = React.useState(video.dislike | 0);
  const [isLiked, setIsLiked] = React.useState(false);
  const [isDisliked, setIsDisliked] = React.useState(false);
  const [showFullDescription, setShowFullDescription] = React.useState(false);

  //TODO: remove the below the static testing user object
  const user: any = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    image: 'https://github.com/shadcn.png?height=32&width=32',
  };

  React.useEffect(() => {
    setLikes(video.like | 0);
    setDislikes(video.dislike | 0);
  }, [video]);

  const handleLike = () => {
    if (!user) return;
    if (isLiked) {
      setLikes((prev: any) => prev - 1);
      setIsLiked(false);
    } else {
      setLikes((prev: any) => prev + 1);
      setIsLiked(true);
      if (isDisliked) {
        setDislikes((prev: any) => prev - 1);
        setIsDisliked(false);
      }
    }
  };
  const handleDislike = () => {
    if (!user) return;
    if (isDisliked) {
      setDislikes((prev: any) => prev - 1);
      setIsDisliked(false);
    } else {
      setDislikes((prev: any) => prev + 1);
      setIsDisliked(true);
      if (isLiked) {
        setLikes((prev: any) => prev - 1);
        setIsLiked(false);
      }
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
        <div className="flex items-center gap-2">
          <div className="flex items-center  rounded-full">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-l-full"
              onClick={handleLike}
            >
              <ThumbsUp
                className={`w-5 h-5 mr-2 ${
                  isLiked ? 'fill-accent-foreground' : ''
                }`}
              />
              {like.toLocaleString()}
            </Button>
            <div className="w-px h-6 " />
            <Button
              variant="ghost"
              size="sm"
              className="rounded-r-full"
              onClick={handleDislike}
            >
              <ThumbsDown
                className={`w-5 h-5 mr-2 ${
                  isDisliked ? 'fill-accent-foreground' : ''
                }`}
              />
              {dislike.toLocaleString()}
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className=" rounded-full"
          >
            <Share className="w-5 h-5 mr-2" />
            Share
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className=" rounded-full"
          >
            <Download className="w-5 h-5 mr-2" />
            Download
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className=" rounded-full"
          >
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <div className=" rounded-lg p-4">
        <div className="flex gap-4 text-sm font-medium mb-2">
          <span>{video.views.toLocaleString()} views</span>
          <span>{uploadTimeCal(video.createdAt)} ago</span>
        </div>
        <div className={`text-sm ${showFullDescription ? '' : 'line-clamp-3'}`}>
          <p>
            Sample video description. This would contain the actual video
            description from the database.
          </p>
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
