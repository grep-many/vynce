// VideoComments.tsx
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { extractInitials, uploadTimeCal } from '@/lib';
import useAuth from '@/hooks/useAuth';
import useComment from '@/hooks/useComment';

interface VideoCommentsProps {
  videoId: string;
}

const VideoComments: React.FC<VideoCommentsProps> = ({ videoId }) => {
  const { user } = useAuth();
  const { comments, fetchComments, addComment, editComment, deleteComment } =
    useComment();

  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (videoId) fetchComments(videoId);
  }, [videoId]);

  // --- Handlers ---
  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user) return;
    setIsSubmitting(true);
    try {
      await addComment({ videoId, commentbody: newComment });
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateComment = async () => {
    if (!editText.trim() || !editingCommentId) return;
    await editComment({ commentId: editingCommentId, commentbody: editText });
    setEditingCommentId(null);
    setEditText('');
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(commentId);
  };

  const handleEditClick = (commentId: string, text: string) => {
    setEditingCommentId(commentId);
    setEditText(text);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{comments.length} Comments</h2>

      {/* New Comment */}
      {user && (
        <div className="flex flex-col sm:flex-row gap-4">
          <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src={user.image} />
              <AvatarFallback>{extractInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex flex-col space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] resize-none border-0 border-b-2 rounded-none focus-visible:ring-0"
            />
            <div className="flex flex-wrap gap-2 justify-end">
              <Button
                variant="secondary"
                onClick={() => setNewComment('')}
                disabled={!newComment.trim()}
                size="sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
                size="sm"
              >
                Comment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center italic">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
            >
              <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarImage src={comment.userImage} />
                  <AvatarFallback>
                    {extractInitials(comment.userName)}
                  </AvatarFallback>
              </Avatar>
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 mb-1">
                  <span className="font-medium text-sm">
                    {comment.userName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {comment.userEmail}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {uploadTimeCal(comment.commentedOn)}
                  </span>
                </div>

                {/* Editing Mode */}
                {editingCommentId === comment._id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className="flex flex-wrap gap-2 justify-end">
                      <Button
                        onClick={handleUpdateComment}
                        disabled={!editText.trim()}
                        size="sm"
                      >
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditText('');
                        }}
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start sm:items-center">
                    <p className="text-sm break-words">{comment.commentbody}</p>

                    {/* Dropdown for edit/delete */}
                    {comment.userid === user?._id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Comment actions"
                          >
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem
                            onClick={() =>
                              handleEditClick(comment._id, comment.commentbody)
                            }
                          >
                            <Edit size={16} className="mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            <Trash2
                              size={16}
                              className="mr-2 text-destructive"
                            />{' '}
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VideoComments;