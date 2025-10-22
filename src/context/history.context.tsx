// src/context/history.context.tsx
import React from 'react';
import { toast } from 'sonner';
import {
  getHistoryVideos,
  addToHistory,
  deleteHistoryItem,
  clearHistory,
} from '@/services/history.service';

interface HistoryContextType {
  videos: any[];
  loading: boolean;
  fetchHistory: () => Promise<void>;
  addVideoToHistory: (videoId: string) => Promise<void>;
  removeVideo: (videoId: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

export const HistoryContext = React.createContext<HistoryContextType>({
  videos: [],
  loading: false,
  fetchHistory: async () => {},
  addVideoToHistory: async () => {},
  removeVideo: async () => {},
  clearAll: async () => {},
});

interface ProviderProps {
  children: React.ReactNode;
}

export const HistoryProvider: React.FC<ProviderProps> = ({ children }) => {
  const [videos, setVideos] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await getHistoryVideos();
      setVideos(res.videos || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const addVideoToHistory = async (videoId: string) => {
    try {
      await addToHistory(videoId);
      await fetchHistory(); // refresh list
    } catch (err: any) {
      toast.error(err.message || 'Failed to add to history');
    }
  };

  const removeVideo = async (videoId: string) => {
    try {
      await deleteHistoryItem(videoId);
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
      toast.success('Removed from history');
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove from history');
    }
  };

  const clearAll = async () => {
    try {
      await clearHistory();
      setVideos([]);
      toast.success('History cleared');
    } catch (err: any) {
      toast.error(err.message || 'Failed to clear history');
    }
  };

  return (
    <HistoryContext.Provider
      value={{
        videos,
        loading,
        fetchHistory,
        addVideoToHistory,
        removeVideo,
        clearAll,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};
