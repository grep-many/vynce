import type mongoose from 'mongoose';
import type { User } from './user';
import type { Video } from './video';
import type { LoginData,ChannelData,AuthContextType } from './auth';

declare global {
  type ProviderProps = {
    children: React.ReactNode;
  };

  type ChannelData = ChannelData
  type LoginData = LoginData
  
  type UserDocument = User;
  type UserModel = mongoose.Model<User>;
  
  type AuthContextType = AuthContextType;
  
  type VideoDocument = Video;
  type VideoModel = mongoose.Model<Video>


}