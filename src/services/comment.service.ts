import axiosInstance from '@/lib/axios';
import { AxiosError } from 'axios';

export interface CommentData {
  videoId: string;
  commentbody: string;
}

export interface EditCommentData {
  commentId: string;
  commentbody: string;
}

export interface Comment {
  _id: string;
  videoid: string;
  userid: string;
  commentbody: string;
  usercommented: string;
  commentedOn: string;
  userImage: string
  userName: string
  userEmail: string

}

// --- Fetch comments for a video ---
export const fetchCommentsAPI = async (videoId: string): Promise<Comment[]> => {
  try {
    const res = await axiosInstance.get(`/comment?videoId=${videoId}`);
    return res.data.comments || [];
  } catch (err: unknown) {
    throw (
      (err as AxiosError<{ message: string }>).response?.data?.message ||
      (err instanceof Error ? err.message : String(err))
    );
  }
};

// --- Add a new comment ---
export const addCommentAPI = async (data: CommentData): Promise<Comment> => {
  try {
    const res = await axiosInstance.post('/comment', data);
    return res.data.comment;
  } catch (err: unknown) {
    throw (
      (err as AxiosError<{ message: string }>).response?.data?.message ||
      (err instanceof Error ? err.message : String(err))
    );
  }
};

// --- Edit a comment ---
export const editCommentAPI = async (data: EditCommentData): Promise<Comment> => {
  try {
    const res = await axiosInstance.put('/comment', data);
    return res.data.comment;
  } catch (err: unknown) {
    throw (
      (err as AxiosError<{ message: string }>).response?.data?.message ||
      (err instanceof Error ? err.message : String(err))
    );
  }
};

// --- Delete a comment ---
export const deleteCommentAPI = async (commentId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/comment?commentId=${commentId}`);
  } catch (err: unknown) {
    throw (
      (err as AxiosError<{ message: string }>).response?.data?.message ||
      (err instanceof Error ? err.message : String(err))
    );
  }
};
