import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { extractInitials } from '@/lib';
import useChannel from '@/hooks/useChannel';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';

interface ChannelHeaderProps {
  channel: any;
  user: any;
  onEdit?: () => void; // optional edit handler for channel owner
}

const ChannelHeader: React.FC<ChannelHeaderProps> = ({
  subscribed,
  isOwner,
  channel,
  user,
  onEdit,
}) => {
  const { subscribe, isChannelSubscribed } = useChannel();
  const isSubscribed = isChannelSubscribed(channel?._id);

  const handleSubscribe = async () => {
    if (!user) return toast.warning("Login to subscribe!");
    await subscribe(channel?._id);
  };


  return (
    <div className="w-full">
      {/* Banner */}
      <div className="relative h-28 sm:h-36 md:h-48 lg:h-60 bg-gradient-to-r from-blue-400 to-purple-500 overflow-hidden rounded-b-md" />

      {/* Channel Info */}
      <div className="p-4 sm:px-6 md:px-8 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
        {/* Avatar */}
        <Avatar className="-mt-12 sm:-mt-16 md:-mt-20 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 border-4 border-white dark:border-gray-900">
          <AvatarImage src={channel.image} alt={channel.name} />
          <AvatarFallback className="text-3xl sm:text-4xl md:text-5xl bg-muted text-muted-foreground">
            {extractInitials(channel?.name)}
          </AvatarFallback>
        </Avatar>

        {/* Channel Text Info */}
        <div className="flex-1 flex flex-col gap-2 relative">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">
              {channel?.name}
            </h1>
            {/* Edit button for channel owner */}
            {isOwner && onEdit && (
              <Button
                onClick={onEdit}
                variant="outline"
                title="Edit Channel"
              >
                <Pencil/>
              </Button>
            )}
          </div>

          {/* Description */}
          {channel?.description && (
            <p className="text-sm sm:text-base text-muted-foreground line-clamp-3">
              {channel.description}
            </p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-muted-foreground">
            <span>@{channel?.name.toLowerCase().replace(/\s+/g, '')}</span>
            <span>{channel?.subscribers} subscribers</span>
          </div>
        </div>

        {/* Subscribe Button */}
        {!isOwner && (
          <Button
            onClick={handleSubscribe}
            variant={subscribed ? 'secondary' : 'destructive'}
            size="sm"
            className="mt-2 md:mt-0 min-w-[120px] sm:min-w-[140px]"
          >
            {subscribed ? 'Subscribed' : 'Subscribe'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChannelHeader;