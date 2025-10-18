import mongoose, { Schema, model, Document } from 'mongoose';

export interface IComment extends Document {
  videoId: string;
  userid: string;
  commentbody: string;
  userName: string;
  userEmail: string;
  userImage?: string;
  commentedOn: Date;
}

const CommentSchema: Schema<IComment> = new Schema(
  {
    videoId: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
    userid: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    commentbody: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userImage: { type: String },
    commentedOn: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// Prevent model recompilation (Next.js hot reload)
const Comment =
  mongoose.models.Comment || model<IComment>('Comment', CommentSchema);

export default Comment;
