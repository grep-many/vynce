import React from 'react';
import {
  getVideos,
  getVideo,
  uploadVideo,
  UploadVideoData,
} from '@/services/video.service';
import { toast } from 'sonner';
import { useRouter } from 'next/router';

interface VideoContextType {
  videos: any[];
  total: number;
  page: number;
  loading: boolean;
  uploadComplete: boolean;
  isUploading: boolean;
  uploadProgress: number;
  setUploadComplete: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>;
  fetchVideos: (args: {
    page?: number;
    search?: string;
    replace?: boolean;
  }) => Promise<void>;
  fetchVideo: (id: string) => Promise<void>;
  upload: (
    data: UploadVideoData,
    onUploadProgress: (percent: number) => void,
  ) => Promise<void>;
}

export const VideoContext = React.createContext<VideoContextType>({
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

interface ProviderProps {
  children: React.ReactNode;
}

export const VideoProvider: React.FC<ProviderProps> = ({ children }) => {
  const [videos, setVideos] = React.useState<any[]>([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [uploadComplete, setUploadComplete] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const router = useRouter();

  const mergeVideos = (existing: any[], incoming: any[], max = 10) => {
    const combined = [...incoming, ...existing];
    const uniqueMap = new Map<string, any>();
    for (const v of combined) {
      if (!uniqueMap.has(v._id)) uniqueMap.set(v._id, v);
    }
    return Array.from(uniqueMap.values()).slice(0, max);
  };

  const fetchVideos = async ({
    page = 1,
    search = '',
    replace = false, // <-- new flag
  }: {
    page?: number;
    search?: string;
    replace?: boolean;
  }) => {
    setLoading(true);
    try {
      const res = await getVideos({ page, search });
      setVideos((prev) =>
        replace ? res.videos : mergeVideos(prev, res.videos, 10),
      );
      setTotal(res.total || 0);
      setPage(page);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch videos');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchVideo = async (id: string) => {
    setLoading(true);
    try {
      const { video } = await getVideo(id);
      setVideos((prev) => mergeVideos(prev, [video], 10));
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch video!');
    } finally {
      setLoading(false);
    }
  };

  const upload = async (
    data: UploadVideoData,
    onUploadProgress: (percent: number) => void,
  ) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadComplete(false);

    try {
      const { video, message } = await uploadVideo(data, onUploadProgress);
      setVideos((prev) => mergeVideos(prev, [video], 10));
      setTotal((prev) => prev + 1);
      setUploadComplete(true);
      toast.success(message);
      return video;
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  React.useEffect(() => {
    fetchVideos({ page: 1 }); // home feed
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
