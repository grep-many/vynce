import mongoose, { Schema, model, Document } from 'mongoose';

export interface IComment extends Document {
  videoId: string;
  userid: string;
  commentbody: string;
  usercommented: string;
  commentedon: Date;
}

const CommentSchema: Schema<IComment> = new Schema(
  {
    videoId: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
    userid: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    commentbody: { type: String, required: true },
    usercommented: { type: String, required: true },
    commentedon: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// Avoid recompiling model if already compiled (Next.js hot reload)
const Comment =
  mongoose.models.Comment || model<IComment>('Comment', CommentSchema);

export default Comment;
