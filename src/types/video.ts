import mongoose from 'mongoose';

export interface Video extends mongoose.Document {
  title: string;
  description: string;
  filename: string;
  filetype: string;
  filepath: string;
  filesize: string;
  channel: string;
  likes: any;
  dislikes: any;
  watchLater: any;
  views: number;
  uploader: string;
  createdAt: Date; // Mongo timestamps can be Date
  updatedAt: Date;
}
