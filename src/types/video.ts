import mongoose from 'mongoose';

export interface Video extends mongoose.Document {
  title: string;
  description: string;
  filename: string;
  filetype: string;
  filepath: string;
  filesize: string;
  channel: any;
  likes: any;
  watchLater: any;
  views: number;
  createdAt: Date; // Mongo timestamps can be Date
  updatedAt: Date;
}
