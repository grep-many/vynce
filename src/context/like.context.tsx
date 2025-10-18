import { likeVideo, getLikedVideos } from '@/services/like.service';
import { Video } from '@/types/video';
import React from 'react';
import { toast } from 'sonner';

interface LikeContextType {
  videos: Video[];
  loading: boolean;
  setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  reactVideo: (id: string, like: boolean) => Promise<void>;
  fetchLikedVideos: () => Promise<void>;
}

export const LikeContext = React.createContext<LikeContextType>({
  loading: false,
  videos: [],
  setVideos: () => {},
  reactVideo: async () => {},
  fetchLikedVideos: async () => {},
});

export const LikeProvider: React.FC<ProviderProps> = ({ children }) => {
  const [loading, setLoading] = React.useState(false);
  const [videos, setVideos] = React.useState<Video[]>([]);

  const reactVideo = async (id: string, like: boolean) => {
    try {
      const { message, ...res } = await likeVideo(id, like);
      toast.success(message);
      return res;
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch videos');
    }
  };

  const fetchLikedVideos = async () => {
    setLoading(true);
    try {
      const res = await getLikedVideos();
      setVideos(res.videos);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };
  return (
    <LikeContext.Provider
      value={{
        loading,
        setVideos,
        videos,
        fetchLikedVideos,
        reactVideo,
      }}
    >
      {children}
    </LikeContext.Provider>
  );
};
