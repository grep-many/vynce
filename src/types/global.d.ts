import type mongoose from 'mongoose';
import type { User } from './user';
import type { AuthContextType,AuthProviderProps } from './auth';

declare global {
  type UserDocument = User;
  type UserModel = mongoose.Model<User>;
  type AuthContextType = AuthContextType;
  type AuthProviderProps = AuthProviderProps;
}