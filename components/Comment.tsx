
import React, { useMemo } from 'react';
import type { Comment as CommentType, User } from '../types';
import { formatDistanceToNow } from 'date-fns';


interface CommentProps {
  comment: CommentType;
  users: User[];
  onSelectUser: (user: User) => void;
}

const Comment: React.FC<CommentProps> = ({ comment, users, onSelectUser }) => {
  const author = useMemo(() => users.find(u => u.id === comment.authorId), [users, comment.authorId]);
  
  const timeAgo = useMemo(() => {
    try {
      return formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true });
    } catch (e) {
        return "a while ago";
    }
  }, [comment.timestamp]);

  if (!author) {
    return null;
  }

  return (
    <div className="flex items-start space-x-3">
      <img
        src={author.avatarUrl}
        alt={author.name}
        className="h-9 w-9 rounded-full cursor-pointer hover:ring-2 ring-indigo-400 transition"
        onClick={() => onSelectUser(author)}
      />
      <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-3">
        <div className="flex items-baseline space-x-2">
          <span 
            className="font-bold text-sm text-slate-800 dark:text-slate-100 cursor-pointer hover:underline"
            onClick={() => onSelectUser(author)}
          >
            {author.name}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">{timeAgo}</span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{comment.text}</p>
      </div>
    </div>
  );
};

export default Comment;
