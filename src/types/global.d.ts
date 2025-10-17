import type mongoose from 'mongoose';
import type { User } from './user';
import type { Video } from './video';
import type { AuthContextType } from './auth';

declare global {
  type ProviderProps = {
    children: React.ReactNode;
  };
  
  type UserDocument = User;
  type UserModel = mongoose.Model<User>;
  
  type AuthContextType = AuthContextType;
  type ChannelContextType = ChannelContextType; 
  type VideoDocument = Video;
  type VideoModel = mongoose.Model<Video>


}