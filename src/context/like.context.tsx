import { likeVideo, getLikedVideos } from '@/services/like.service';
import React from 'react';
import { toast } from 'sonner';

interface LikeContextType {
  videos: any[];
  loading: boolean;
  setVideos: React.Dispatch<React.SetStateAction<any[]>>;
  reactVideo: (id: string, like: boolean) => Promise<any>;
  fetchLikedVideos: () => Promise<void>;
  isLikedVideo: (id: string) => boolean;
}

export const LikeContext = React.createContext<LikeContextType>({
  loading: false,
  videos: [],
  setVideos: () => {},
  reactVideo: async () => {},
  fetchLikedVideos: async () => {},
  isLikedVideo: () => false,
});

export const LikeProvider: React.FC<any> = ({ children }) => {
  const [loading, setLoading] = React.useState(false);
  const [videos, setVideos] = React.useState<any[]>([]);

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

  const isLikedVideo = (id: string) => videos.some((ch) => ch._id === id);

  // React.useEffect(() => {
  //   fetchLikedVideos();
  // }, []);

  return (
    <LikeContext.Provider
      value={{
        loading,
        setVideos,
        videos,
        fetchLikedVideos,
        reactVideo,
        isLikedVideo,
      }}
    >
      {children}
    </LikeContext.Provider>
  );
};
