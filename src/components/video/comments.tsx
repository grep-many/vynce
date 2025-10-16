import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { extractInitials, uploadTimeCal } from '@/lib';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface Comment {
  _id: string;
  videoid: string;
  userid: string;
  commentbody: string;
  usercommented: string;
  commentedon: string;
}

const VideoComments = ({ videoId }: any) => {
  //TODO: remove the below the static testing user object and refactor states
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [newComment, setNewComment] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [editingCommentId, setEditingCommentId] = React.useState<string | null>(
    null,
  );
  const [editText, setEditText] = React.useState('');

  const user: any = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    image: 'https://github.com/shadcn.png?height=32&width=32',
  };

  const fetchedComments = [
    {
      _id: '1',
      videoid: videoId,
      userid: '1',
      commentbody: 'Great video! Really enjoyed watching this.',
      usercommented: 'John Doe',
      commentedon: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      _id: '2',
      videoid: videoId,
      userid: '2',
      commentbody: 'Thanks for sharing this amazing content!',
      usercommented: 'Jane Smith',
      commentedon: new Date(Date.now() - 7200000).toISOString(),
    },
  ];

  const loadComments = async () => {
    setComments(fetchedComments);
  };

  React.useEffect(() => {
    loadComments();
  }, []);

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;
    setIsSubmitting(true);
    setIsSubmitting(true);
    const newCommentObj: Comment = {
      _id: Date.now().toString(),
      videoid: videoId,
      userid: user._id,
      commentbody: newComment,
      usercommented: user.name || 'Anonymous',
      commentedon: new Date().toISOString(),
    };
    setComments([newCommentObj, ...comments]);
    setNewComment('');
  };

  const handleEdit = (comment: Comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.commentbody);
  };

  const handleUpdateComment = async () => {
    if (!editText.trim()) return;
    setComments((prev) =>
      prev.map((c) =>
        c._id === editingCommentId ? { ...c, commentbody: editText } : c,
      ),
    );
    setEditingCommentId(null);
    setEditText('');
  };

  const handleDelete = async (id: string) => {
    setComments((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{comments.length} Comments</h2>
      {user && (
        <div className="flex gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.image || ''} />
            <AvatarFallback>{extractInitials(user.name) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e: any) => setNewComment(e.target.value)}
              className="min-h-[80px] resize-none border-0 border-b-2 rounded-none focus-visible:ring-0"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="secondary"
                onClick={() => setNewComment('')}
                disabled={!newComment.trim()}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
              >
                Comment
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-muted italic">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>{extractInitials(comment.usercommented)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {comment.usercommented}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {uploadTimeCal(comment.commentedon)}
                  </span>
                </div>

                {editingCommentId === comment._id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        onClick={handleUpdateComment}
                        disabled={!editText.trim()}
                      >
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditText('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm">{comment.commentbody}</p>
                    {comment.userid === user?._id && (
                      <div className="flex gap-2 mt-2 text-sm text-muted">
                        <button onClick={() => handleEdit(comment)}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(comment._id)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </>
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
