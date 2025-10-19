import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { extractInitials } from '@/lib';
import useChannel from '@/hooks/useChannel';

interface ChannelHeaderProps {
  channel: any;
  user: any;
}

const ChannelHeader: React.FC<ChannelHeaderProps> = ({ channel, user }) => {
  const { subscribe, subscribedChannels, isChannelSubscribed } = useChannel();

  const isSubscribed = isChannelSubscribed(channel?._id);

  const handleSubscribe = async () => {
    if (!user) return;
    await subscribe(channel?._id);
  };

  return (
    <div className="w-full">
      {/* Banner */}
      <div className="relative h-28 sm:h-36 md:h-48 lg:h-60 bg-gradient-to-r from-blue-400 to-purple-500 overflow-hidden rounded-b-md"></div>

      {/* Channel Info */}
      <div className="p-4 sm:px-6 md:px-8 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
        {/* Avatar */}
        <Avatar className="-mt-12 sm:-mt-16 md:-mt-20 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 border-4 border-white dark:border-gray-900">
          {channel?.image ? (
            <AvatarImage src={channel.image} alt={channel.name} />
          ) : (
            <AvatarFallback className="text-3xl sm:text-4xl md:text-5xl bg-muted text-muted-foreground">
              {extractInitials(channel?.name)}
            </AvatarFallback>
          )}
        </Avatar>

        {/* Channel Text Info */}
        <div className="flex-1 flex flex-col gap-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">
            {channel?.name}
          </h1>
          {channel?.description && (
            <p className="text-sm sm:text-base text-muted-foreground line-clamp-3">
              {channel.description}
            </p>
          )}
          <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-muted-foreground">
            <span>@{channel?.name.toLowerCase().replace(/\s+/g, '')}</span>
            <span>{channel?.subscribers} subscribers</span>
          </div>
        </div>

        {/* Subscribe Button */}
        {user && user._id !== channel?.owner && (
          <div className="mt-2 md:mt-0">
            <Button
              onClick={handleSubscribe}
              variant={isSubscribed ? 'secondary' : 'destructive'}
              size="sm"
              className="min-w-[120px] sm:min-w-[140px]"
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelHeader;
