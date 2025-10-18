import mongoose from 'mongoose';

interface HistoryDocument extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  video: mongoose.Schema.Types.ObjectId;
  watchedOn: Date;
}

const historySchema = new mongoose.Schema<HistoryDocument>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
    },
    watchedOn: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const History =
  mongoose.models.History ||
  mongoose.model<HistoryDocument>('History', historySchema);
export default History;
