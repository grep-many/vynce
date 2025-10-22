import React from 'react';
import { toast } from 'sonner';
import {
  getWatchLaterVideos,
  toggleWatchLater,
} from '@/services/watch.service';

interface WatchLaterContextType {
  videos: any[];
  loading: boolean;
  setVideos: React.Dispatch<React.SetStateAction<any[]>>;
  fetchWatchLaterVideos: () => Promise<void>;
  toggleWatchLater: (id: string) => Promise<void>;
}

export const WatchContext = React.createContext<WatchLaterContextType>({
  videos: [],
  loading: false,
  setVideos: () => {},
  fetchWatchLaterVideos: async () => {},
  toggleWatchLater: async () => {},
});

export const WatchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [videos, setVideos] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchWatchLaterVideos = async () => {
    setLoading(true);
    try {
      const { videos } = await getWatchLaterVideos();
      setVideos(videos);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch Watch Later videos');
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchLaterHandler = async (id: string) => {
    try {
      const { message } = await toggleWatchLater(id);
      toast.success(message);
      setVideos((prev) => prev.filter((v) => v._id !== id)); // remove if un-added
    } catch (err: any) {
      toast.error(err.message || 'Failed to update Watch Later');
    }
  };

  return (
    <WatchContext.Provider
      value={{
        videos,
        setVideos,
        loading,
        fetchWatchLaterVideos,
        toggleWatchLater: toggleWatchLaterHandler,
      }}
    >
      {children}
    </WatchContext.Provider>
  );
};
