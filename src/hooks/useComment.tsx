import React from 'react';
import { CommentContext } from '@/context/comment.context';

const useComment = () => {
  const context = React.useContext(CommentContext);
  if (!context) {
    throw new Error('useComment must be used within a CommentProvider!');
  }
  return context;
};

export default useComment;
