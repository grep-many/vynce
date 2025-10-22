import React from 'react';
import { useRouter } from 'next/navigation';
import useHistory from '@/hooks/useHistory';
import Content from '@/components/video/content';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';
import NotFound from '@/components/not-found';
import Head from 'next/head';

const HistoryPage: React.FC = () => {
  const router = useRouter();
  const { videos, fetchHistory, removeVideo, clearAll } = useHistory();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  // Not signed in
  if (!user) {
    return (
      <NotFound
        message="You need to sign in to view your watch history."
        button={{
          text: 'Sign In',
          onClick: () => router.push('/signin'),
        }}
      />
    );
  }

  // No videos in history
  if (videos.length === 0) {
    return (
      <NotFound
        message="You haven't watched any videos yet."
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
        <title>Watch History - Vynce</title>
        <meta
          name="description"
          content="Revisit your recently watched videos on Vynce. Access your full watch history in one place."
        />
        <meta property="og:title" content="Watch History - Vynce" />
        <meta
          property="og:description"
          content="Explore your viewing journey and continue where you left off."
        />
        <meta property="og:image" content="/android-chrome-512x512.png" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://vynce.vercel.app/history" />
      </Head>
      <main className="p-6">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-bold mb-4">Watch History</h1>
          {videos.length > 0 && (
            <Button
              variant="destructive"
              onClick={clearAll}
              className="mb-4 px-4 py-2 rounded"
            >
              Clear All
            </Button>
          )}
          <Content
            videos={videos}
            type="history"
            onRemove={removeVideo}
          />
        </div>
      </main>
    </>
  );
};

export default HistoryPage;