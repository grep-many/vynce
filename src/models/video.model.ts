import mongoose from 'mongoose';
import Channel from './channel.model';

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    filename: {
      type: String,
      required: [true, 'Filename is required'],
    },
    filetype: {
      type: String,
      required: [true, 'Filetype is required'],
    },
    filepath: {
      type: String,
      required: [true, 'Filepath is required'],
    },
    filesize: {
      type: String,
      required: [true, 'Filesize is required'],
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    watchLater: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Video = mongoose.models.Video || mongoose.model('Video', videoSchema);

export default Video;
