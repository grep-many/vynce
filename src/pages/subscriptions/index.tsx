import React from 'react';
import useAuth from '@/hooks/useAuth';
import useChannel from '@/hooks/useChannel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { X } from 'lucide-react';

const Subscriptions: React.FC = () => {
  const { subscribedChannels, fetchSubscribedChannels, subscribe } =
    useChannel();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) fetchSubscribedChannels();
  }, [user]);

  const handleRemove = async (id: string) => {
    await subscribe(id); // toggle unsubscribe
  };

  if (!subscribedChannels || subscribedChannels.length === 0) {
    return (
      <main className="p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Subscriptions</h1>
          <p className="text-muted-foreground">
            You are not subscribed to any channels yet.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subscribedChannels.map((channel) => (
            <div
              key={channel._id}
              className="group relative flex flex-col gap-3 p-4 rounded-lg transition hover:bg-secondary/20"
            >
              {/* Channel Image */}
              <Link href={`/channel/${channel._id}`}>
                <Avatar className="w-full h-48 rounded-md overflow-hidden bg-muted">
                  <AvatarImage src={channel.image} alt={channel.name} />
                  <AvatarFallback className="text-xl">
                    {channel.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>

              {/* Channel Info */}
              <div className="flex flex-col gap-1">
                <Link
                  href={`/channel/${channel._id}`}
                  className="text-lg font-medium line-clamp-1 hover:text-blue-600"
                >
                  {channel.name}
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {channel.description || 'No description available'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {channel.subscribers?.length || 0} subscribers
                </p>
              </div>

              {/* Unsubscribe Button */}
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                onClick={() => handleRemove(channel._id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Subscriptions;
