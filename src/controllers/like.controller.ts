import { NextApiResponse } from "next";
import { APIReq } from "./user.controller";
import Video from "@/models/video.model";

export const toggleReaction = async (
  req: APIReq,
  res: NextApiResponse,
) => {
  try {
    const { videoId, like } = req.body; // like: true => like, false => dislike
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!videoId || typeof like !== 'boolean')
      return res
        .status(400)
        .json({ message: 'Video ID and like boolean are required' });

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const likes = video.likes;
    const dislikes = video.dislikes;

    if (like) {
      // Toggle like
      if (likes.includes(userId)) {
        likes.pull(userId); // remove like
        await video.save();
        return res
          .status(200)
          .json({
            message: 'Like removed!',
            likes: likes.length,
            dislikes: dislikes.length,
          });
      }
      likes.push(userId);
      if (dislikes.includes(userId)) dislikes.pull(userId); // remove opposite
    } else {
      // Toggle dislike
      if (dislikes.includes(userId)) {
        dislikes.pull(userId); // remove dislike
        await video.save();
        return res
          .status(200)
          .json({
            message: 'Dislike removed!',
            likes: likes.length,
            dislikes: dislikes.length,
          });
      }
      dislikes.push(userId);
      if (likes.includes(userId)) likes.pull(userId); // remove opposite
    }

    await video.save();
    return res.status(200).json({
      message: like ? 'Like added!' : 'Dislike added!',
      likes: likes.length,
      dislikes: dislikes.length,
    });
  } catch (err: any) {
    console.error('Toggle reaction error:', err);
    return res
      .status(500)
      .json({ message: 'Internal server error', error: err.message });
  }
};