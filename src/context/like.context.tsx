import { likeVideo, getLikedVideos } from '@/services/like.service';
import React from 'react';
import { toast } from 'sonner';

interface LikeContextType {
  likedVideos: any[];
  loading: boolean;
  setLikedVideos: React.Dispatch<React.SetStateAction<any[]>>;
  reactVideo: (id: string, like: boolean) => Promise<any>;
  fetchLikedVideos: () => Promise<void>;
  isLikedVideo: (id: string) => boolean;
}

export const LikeContext = React.createContext<LikeContextType>({
  loading: false,
  likedVideos: [],
  setLikedVideos: () => {},
  reactVideo: async () => {},
  fetchLikedVideos: async () => {},
  isLikedVideo: () => false,
});

export const LikeProvider: React.FC<any> = ({ children }) => {
  const [loading, setLoading] = React.useState(false);
  const [likedVideos, setLikedVideos] = React.useState<any[]>([]);

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
      setLikedVideos(res.videos);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  const isLikedVideo = (id: string) => likedVideos.some((ch) => ch._id === id);

  // React.useEffect(() => {
  //   fetchLikedVideos();
  // }, []);

  return (
    <LikeContext.Provider
      value={{
        loading,
        setLikedVideos,
        likedVideos,
        fetchLikedVideos,
        reactVideo,
        isLikedVideo,
      }}
    >
      {children}
    </LikeContext.Provider>
  );
};
