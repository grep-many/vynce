import { Check, FileVideo, Upload, X } from 'lucide-react';
import React, { ChangeEvent, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { Textarea } from '../ui/textarea';
import useVideo from '@/hooks/useVideo';
import { useRouter } from 'next/router';

const VideoUploader = () => {
  const {
    uploadComplete,
    isUploading,
    uploadProgress,
    setUploadComplete,
    setIsUploading,
    setUploadProgress,
    upload,
  } = useVideo();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const router = useRouter()

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlefilechange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleChange=  (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setVideoFile(null);
    setFormData({
      title: '',
      description: '',
    });
    setIsUploading(false);
    setUploadProgress(0);
    setUploadComplete(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const cancelUpload = () => {
    resetForm();
  };

  const handleUpload = async () => {
    if (!videoFile) return;
    await upload({...formData,file:videoFile},
      (percent:number) => setUploadProgress(percent),
    ).then((video) => {
      resetForm()
      router.push(`/watch/${video?._id}`)
    })
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg p-6 border border-border">
      <h2 className="text-xl font-semibold mb-4">Upload a video</h2>

      <div className="space-y-4">
        {!videoFile ? (
          <div
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-medium">
              Drag and drop video files to upload (should be less than 4mb)
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to select files
            </p>
            <input
              type="file"
              name="file"
              ref={fileInputRef}
              className="hidden"
              accept="video/*"
              onChange={handlefilechange}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
              <div className="bg-primary/10 p-2 rounded-md">
                <FileVideo className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{videoFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              {!isUploading && (
                <Button variant="ghost" size="icon" onClick={cancelUpload}>
                  <X className="w-5 h-5" />
                </Button>
              )}
              {uploadComplete && (
                <div className="bg-success/10 p-1 rounded-full">
                  <Check className="w-5 h-5 text-success" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="title">Title (required)</Label>
                <Input
                  id="title"
                  value={formData.title}
                  name="title"
                  onChange={handleChange}
                  placeholder="Add a title that describes your video"
                  disabled={isUploading || uploadComplete}
                  className="mt-1"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="description">Description (required)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell viewers about your video..."
                />
              </div>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            <div className="flex justify-end gap-3">
              {!uploadComplete && (
                <>
                  <Button
                    variant="outline"
                    onClick={cancelUpload}
                    disabled={uploadComplete}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={
                      isUploading ||
                      !formData.title.trim() ||
                      !formData.description.trim() ||
                      uploadComplete
                    }
                  >
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoUploader;
