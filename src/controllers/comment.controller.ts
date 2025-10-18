import { NextApiRequest, NextApiResponse } from 'next';
import Comment, { IComment } from '@/models/comment.model';
import mongoose from 'mongoose';
import User from '@/models/user.model';

// Extend NextApiRequest to include authenticated user
interface AuthenticatedRequest extends NextApiRequest {
  user?: { _id: string; name: string };
}

// --- Fetch comments for a video ---
export const getComments = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  try {
    const { videoId } = req.query;
    if (!videoId || typeof videoId !== 'string') {
      return res.status(400).json({ message: 'videoId is required' });
    }

    const comments = await Comment.find({ videoId })
      .sort({ commentedon: -1 })
      .lean();

    return res.status(200).json({ comments:comments||[] });
  } catch (err: any) {
    console.error('Get comments error:', err);
    return res
      .status(500)
      .json({ message: 'Failed to fetch comments', error: err.message });
  }
};

// --- Add a new comment ---
export const addComment = async (
  req: AuthenticatedRequest,
  res: NextApiResponse,
) => {
  try {
    const { videoId, commentbody } = req.body;
    if (!req.user?._id)
      return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message:"user not found!"
      })
    }

    if (!videoId || !commentbody)
      return res.status(400).json({ message: 'Missing fields' });

    const newComment = await Comment.create({
      videoId,
      userid: user._id,
      commentbody,
      userName: user.name || 'Anonymous',
      userEmail: user.email || 'unknown@example.com',
      userImage: user.image,
    });

    return res
      .status(201)
      .json({ message: 'Comment added', comment: newComment });
  } catch (err: any) {
    console.error('Add comment error:', err);
    return res
      .status(500)
      .json({ message: 'Failed to add comment', error: err.message });
  }
};

// --- Edit a comment ---
export const editComment = async (
  req: AuthenticatedRequest,
  res: NextApiResponse,
) => {
  try {
    const { commentId, commentbody } = req.body;
    if (!req.user?._id)
      return res.status(401).json({ message: 'Unauthorized' });
    if (!commentId || !commentbody)
      return res.status(400).json({ message: 'Missing fields' });

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.userid.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: 'Forbidden: cannot edit others comments' });
    }

    comment.commentbody = commentbody;
    await comment.save();

    return res.status(200).json({ message: 'Comment updated', comment });
  } catch (err: any) {
    console.error('Edit comment error:', err);
    return res
      .status(500)
      .json({ message: 'Failed to edit comment', error: err.message });
  }
};

// --- Delete a comment ---
export const deleteComment = async (
  req: AuthenticatedRequest,
  res: NextApiResponse,
) => {
  try {
    const { commentId } = req.query;
    if (!req.user?._id)
      return res.status(401).json({ message: 'Unauthorized' });
    if (!commentId || typeof commentId !== 'string')
      return res.status(400).json({ message: 'commentId is required' });

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.userid.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: 'Forbidden: cannot delete others comments' });
    }

    await comment.deleteOne();

    return res.status(200).json({ message: 'Comment deleted' });
  } catch (err: any) {
    console.error('Delete comment error:', err);
    return res
      .status(500)
      .json({ message: 'Failed to delete comment', error: err.message });
  }
};
