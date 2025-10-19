import mongoose, { Schema, model, Document } from 'mongoose';

// Interface for a comment document
interface IComment extends Document {
  videoId: mongoose.Types.ObjectId | string;
  userid: mongoose.Types.ObjectId | string;
  commentbody: string;
  userName: string;
  userEmail: string;
  userImage?: string;
  commentedOn: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition
const CommentSchema = new Schema<IComment>(
  {
    videoId: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
    userid: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    commentbody: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userImage: { type: String, default: '' },
    commentedOn: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  },
);

// Avoid recompiling model on Next.js hot reload
const Comment =
  mongoose.models.Comment || model<IComment>('Comment', CommentSchema);

export default Comment;
