import mongoose from 'mongoose';

const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: { type: String, required: [true, 'Name is required'] },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    channel: {
      name: { type: String },
      description: { type: String },
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);

const User: UserModel =
  mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);

export default User;
