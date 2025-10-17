import mongoose from 'mongoose';

export interface User extends mongoose.Document {
  name: string;
  email: string;
  channelname?: string;
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}