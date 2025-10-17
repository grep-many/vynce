import React, { ReactNode, createContext, useState } from 'react';
import { uploadVideo, UploadVideoData } from '@/services/video.service';
import { toast } from 'sonner';

interface VideoContextType {
  uploadComplete: boolean;
  setUploadComplete: React.Dispatch<React.SetStateAction<boolean>>;
  isUploading: boolean;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  uploadProgress: number;
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>;
  upload: (
    data: UploadVideoData,
    onUploadProgress: (percent: number) => void,
  ) => Promise<void>;
}

interface ProviderProps {
  children: ReactNode;
}

export const VideoContext = createContext<VideoContextType>({
  uploadComplete: false,
  setUploadComplete: () => {},
  isUploading: false,
  setIsUploading: () => {},
  uploadProgress: 0,
  setUploadProgress: () => {},
  upload: async (
    _data: UploadVideoData,
    _onUploadProgress: (percent: number) => void,
  ) => {},
});

export const VideoProvider: React.FC<ProviderProps> = ({ children }) => {
  const [uploadComplete, setUploadComplete] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const upload = async (
    data: UploadVideoData,
    onUploadProgress: (percent: number) => void,
  ) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadComplete(false);

    try {
      // Pass the callback to the service
      const {message} = await uploadVideo(data, onUploadProgress);
      setUploadComplete(true);
      toast.success(message)
    } catch (err: any) {
      toast.error(err)
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <VideoContext.Provider
      value={{
        uploadComplete,
        setUploadComplete,
        isUploading,
        setIsUploading,
        uploadProgress,
        setUploadProgress,
        upload,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
