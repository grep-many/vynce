import React from 'react';
import Content from '@/components/video/content';
import useLike from '@/hooks/useLike';
import useAuth from '@/hooks/useAuth';

const Liked = () => {
  const { videos,setVideos, fetchLikedVideos,reactVideo } = useLike();
  const {user}= useAuth()

  const handleRemove=async(id:string) => {
    await reactVideo(id,true)
    setVideos((prev) => prev.filter((v) => v._id !== id));
  }

  React.useEffect(() => {
    fetchLikedVideos()
  },[])

  return (
    <main className="p-6">
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Liked Videos</h1>
        <Content
          videos={videos}
          type="liked"
          user={user}
          onRemove={handleRemove}
          emptyMessage="You haven't liked any videos yet."
        />
      </div>
    </main>
  );
};

export default Liked;
