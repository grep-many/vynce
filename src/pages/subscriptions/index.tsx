import React from 'react';
import { useRouter } from 'next/navigation'; // Next 13+ app router
import useAuth from '@/hooks/useAuth';
import useChannel from '@/hooks/useChannel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { X } from 'lucide-react';
import NotFound from '@/components/not-found';
import Head from 'next/head';

const Subscriptions: React.FC = () => {
  const router = useRouter();
  const { subscribedChannels, fetchSubscribedChannels, subscribe } =
    useChannel();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) fetchSubscribedChannels();
  }, [user]);

  const handleRemove = async (id: string) => {
    await subscribe(id); // toggle unsubscribe
  };

  // Conditional rendering for no subscriptions or not signed in
  if (!user) {
    return (
      <NotFound
        message="You need to sign in to view your subscriptions."
        button={{
          text: 'Sign In',
          onClick: () => router.push('/signin'),
        }}
      />
    );
  }

  if (!subscribedChannels || subscribedChannels.length === 0) {
    return (
      <NotFound
        message="You are not subscribed to any channels yet."
        button={{
          text: 'Explore Videos',
          onClick: () => router.push('/'),
        }}
      />
    );
  }

  return (
    <>
      <Head>
        <title>Subscriptions - Vynce</title>
        <meta
          name="description"
          content="Stay up-to-date with your favorite creators. View all your subscriptions and their latest uploads on Vynce."
        />
        <meta property="og:title" content="Subscriptions - Vynce" />
        <meta
          property="og:description"
          content="Catch the latest videos from creators you’re subscribed to on Vynce."
        />
        <meta property="og:image" content="/android-chrome-512x512.png" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://vynce.vercel.app/subscription" />
      </Head>
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subscribedChannels.map((channel) => (
              <div
                key={channel._id}
                className="bg-card relative flex flex-col gap-3 p-4 rounded-lg transition hover:bg-secondary/20"
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
                    className="text-lg font-medium line-clamp-1 hover:text-foreground/70"
                  >
                    {channel.name}
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {channel.description || 'No description available'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {channel.subscribers || 0} subscribers
                  </p>
                </div>

                {/* Unsubscribe Button */}
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 transition"
                  onClick={() => handleRemove(channel._id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Subscriptions;
