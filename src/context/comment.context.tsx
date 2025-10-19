import React, { ReactNode } from 'react';
import {
  fetchCommentsAPI,
  addCommentAPI,
  editCommentAPI,
  deleteCommentAPI,
  Comment,
  CommentData,
  EditCommentData,
} from '@/services/comment.service';
import { toast } from 'sonner';

interface CommentContextType {
  comments: Comment[];
  loading: boolean;
  fetchComments: (videoId: string) => Promise<void>;
  addComment: (data: CommentData) => Promise<void>;
  editComment: (data: EditCommentData) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
}

export const CommentContext = React.createContext<CommentContextType>({
  comments: [],
  loading: false,
  fetchComments: async () => {},
  addComment: async () => {},
  editComment: async () => {},
  deleteComment: async () => {},
});

interface ProviderProps {
  children: ReactNode;
}

export const CommentProvider: React.FC<ProviderProps> = ({ children }) => {
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [loading, setLoading] = React.useState(false);

  // --- Fetch comments for a video ---
  const fetchComments = async (videoId: string) => {
    setLoading(true);
    try {
      const fetched = await fetchCommentsAPI(videoId);
      setComments(fetched);
    } catch (err: any) {
      console.error('Failed to fetch comments:', err);
      toast.error(err || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  // --- Add new comment ---
  const addComment = async (data: CommentData) => {
    try {
      const newComment = await addCommentAPI(data);
      setComments((prev) => [newComment, ...prev]);
      toast.success('Comment added');
    } catch (err: any) {
      console.error('Failed to add comment:', err);
      toast.error(err || 'Failed to add comment');
    }
  };

  // --- Edit existing comment ---
  const editComment = async (data: EditCommentData) => {
    try {
      const updatedComment = await editCommentAPI(data);
      setComments((prev) =>
        prev.map((c) => (c._id === data.commentId ? updatedComment : c)),
      );
      toast.success('Comment updated');
    } catch (err: any) {
      console.error('Failed to edit comment:', err);
      toast.error(err || 'Failed to edit comment');
    }
  };

  // --- Delete comment ---
  const deleteComment = async (commentId: string) => {
    try {
      await deleteCommentAPI(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success('Comment deleted');
    } catch (err: any) {
      console.error('Failed to delete comment:', err);
      toast.error(err || 'Failed to delete comment');
    }
  };

  return (
    <CommentContext.Provider
      value={{
        comments,
        loading,
        fetchComments,
        addComment,
        editComment,
        deleteComment,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};
