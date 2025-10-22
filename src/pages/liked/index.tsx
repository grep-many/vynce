import React from 'react';
import { useRouter } from 'next/navigation';
import Content from '@/components/video/content';
import useLike from '@/hooks/useLike';
import useAuth from '@/hooks/useAuth';
import NotFound from '@/components/not-found';
import Head from 'next/head';

const Liked: React.FC = () => {
  const router = useRouter();
  const { videos, setVideos, fetchLikedVideos, reactVideo } = useLike();
  const { user } = useAuth();

  const handleRemove = async (id: string) => {
    await reactVideo(id, true);
    setVideos((prev) => prev.filter((v) => v._id !== id));
  };

  React.useEffect(() => {
    if (user) fetchLikedVideos();
  }, [user]);

  // Not signed in
  if (!user) {
    return (
      <NotFound
        message="You need to sign in to view your liked videos."
        button={{
          text: 'Sign In',
          onClick: () => router.push('/signin'),
        }}
      />
    );
  }

  // No liked videos
  if (videos.length === 0) {
    return (
      <NotFound
        message="You haven't liked any videos yet."
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
              <title>Liked Videos - Vynce</title>
              <meta
                name="description"
                content="See all your liked videos in one place on Vynce."
              />
              <link rel="canonical" href="https://vynce.vercel.app/liked" />
            </Head>
    <main className="p-6">
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Liked Videos</h1>
        <Content
          videos={videos}
          type="liked"
          onRemove={handleRemove}
          />
      </div>
    </main>
          </>
  );
};

export default Liked;
