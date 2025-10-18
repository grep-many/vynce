import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema<VideoDocument>(
  {
    title: {
      type: String,
      required: [true, 'title is required'],
    },
    description: {
      type: String,
      required: [true, 'description is required'],
    },
    filename: {
      type: String,
      required: [true, 'filename is required'],
    },
    filetype: {
      type: String,
      required: [true, 'filetype is required'],
    },
    filepath: {
      type: String,
      required: [true, 'filepath is required'],
    },
    filesize: {
      type: String,
      required: [true, 'filesize is required'],
    },
    channel: {
      type: String,
      required: [true, 'channel is required'],
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    watchLater: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 },
    uploader: {
      type: String,
      required: [true, 'Uploader is required'],
    },
  },
  { timestamps: true },
);

const Video: VideoModel =
  mongoose.models.Video || mongoose.model<VideoDocument>('Video', videoSchema);

export default Video;
