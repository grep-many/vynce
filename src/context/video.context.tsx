import React, { ReactNode, createContext, useState, useEffect } from 'react';
import {
  getVideos,
  getVideo,
  uploadVideo,
  UploadVideoData,
} from '@/services/video.service';
import { Video } from '@/types/video';
import { toast } from 'sonner';

interface VideoContextType {
  videos: Video[];
  total: number;
  page: number;
  loading: boolean;
  uploadComplete: boolean;
  isUploading: boolean;
  uploadProgress: number;
  setUploadComplete: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>;
  fetchVideos: (page?: number) => Promise<void>;
  fetchVideo: (id: string) => Promise<void>;
  upload: (
    data: UploadVideoData,
    onUploadProgress: (percent: number) => void,
  ) => Promise<void>;
}

interface ProviderProps {
  children: ReactNode;
}

export const VideoContext = createContext<VideoContextType>({
  videos: [],
  total: 0,
  page: 1,
  loading: false,
  uploadComplete: false,
  isUploading: false,
  uploadProgress: 0,
  setUploadComplete: () => {},
  setIsUploading: () => {},
  setUploadProgress: () => {},
  fetchVideos: async () => {},
  fetchVideo: async () => {},
  upload: async () => {},
});

export const VideoProvider: React.FC<ProviderProps> = ({ children }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [uploadComplete, setUploadComplete] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // --- Helper: merge new videos on top, remove duplicates, keep max 10 ---
  const mergeVideos = (
    existing: Video[],
    incoming: Video[],
    max = 10,
  ): Video[] => {
    const combined = [...incoming, ...existing]; // new videos first
    const uniqueMap = new Map<string, Video>();
    for (const v of combined) {
      if (!uniqueMap.has(v._id)) {
        uniqueMap.set(v._id, v);
      }
    }
    return Array.from(uniqueMap.values()).slice(0, max);
  };

  // --- Fetch paginated videos ---
  const fetchVideos = async (newPage: number = 1) => {
    setLoading(true);
    try {
      const res = await getVideos({ page: newPage });
      const fetched = Array.isArray(res.videos) ? res.videos : [];

      setVideos((prev) => mergeVideos(prev, fetched, 10));
      setTotal(res.total || 0);
      setPage(newPage);
    } catch (err: any) {
      console.error('Error fetching videos:', err);
      toast.error(err.message || 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch single video by ID ---
  const fetchVideo = async (id: string) => {
    setLoading(true);
    try {
      const { video } = await getVideo(id);
      setVideos((prev) => mergeVideos(prev, [video], 10));
    } catch (err: any) {
      console.error('Error fetching video:', err);
      toast.error(err.message || 'Failed to fetch video!');
    } finally {
      setLoading(false);
    }
  };

  // --- Upload video ---
  const upload = async (
    data: UploadVideoData,
    onUploadProgress: (percent: number) => void,
  ) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadComplete(false);

    try {
      const { video, message } = await uploadVideo(data, onUploadProgress);
      setUploadComplete(true);
      toast.success(message);

      // Add uploaded video on top, remove old ones if needed
      setVideos((prev) => mergeVideos(prev, [video], 10));
      setTotal((prev) => prev + 1);
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchVideos(1);
  }, []);

  return (
    <VideoContext.Provider
      value={{
        videos,
        total,
        page,
        loading,
        uploadComplete,
        isUploading,
        uploadProgress,
        setUploadComplete,
        setIsUploading,
        setUploadProgress,
        fetchVideos,
        fetchVideo,
        upload,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
