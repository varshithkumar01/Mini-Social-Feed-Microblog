
import React, { useState, useMemo, useEffect } from 'react';
import type { Post, User, Comment as CommentType } from '../types';
import { HeartIcon, CommentIcon } from './icons/SocialIcons';
import Comment from './Comment';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
  users: User[];
  currentUser: User;
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onSelectUser: (user: User) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, users, currentUser, onToggleLike, onAddComment, onSelectUser }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const author = useMemo(() => users.find(u => u.id === post.authorId), [users, post.authorId]);
  
  const isLiked = useMemo(() => post.likedBy.includes(currentUser.id), [post.likedBy, currentUser.id]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(post.id, commentText);
      setCommentText('');
    }
  };

  const handleLikeClick = () => {
    if (!isLiked) {
      setIsAnimating(true);
    }
    onToggleLike(post.id);
  };

  useEffect(() => {
    if (!isAnimating) return;
    const timer = setTimeout(() => setIsAnimating(false), 300); // Animation duration
    return () => clearTimeout(timer);
  }, [isAnimating]);
  
  const timeAgo = useMemo(() => {
    try {
      return formatDistanceToNow(new Date(post.timestamp), { addSuffix: true });
    } catch (e) {
      return "a while ago";
    }
  }, [post.timestamp]);


  if (!author) {
    return null; // Or a placeholder for a deleted user
  }

  return (
    <article className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-lg">
      <div className="p-5">
        <div className="flex items-center space-x-3">
          <img 
            src={author.avatarUrl} 
            alt={author.name} 
            className="h-12 w-12 rounded-full cursor-pointer hover:ring-2 ring-indigo-500 transition"
            onClick={() => onSelectUser(author)}
          />
          <div>
            <h3 
              className="text-md font-bold text-slate-800 dark:text-slate-100 cursor-pointer hover:underline"
              onClick={() => onSelectUser(author)}
            >
              {author.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">@{author.username} &middot; {timeAgo}</p>
          </div>
        </div>
        <p className="mt-4 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{post.content}</p>
      </div>
      
      <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-6 text-slate-500 dark:text-slate-400">
          <button 
            onClick={handleLikeClick}
            className={`flex items-center space-x-1.5 group focus:outline-none transition-colors duration-200 ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
            aria-pressed={isLiked}
            aria-label={isLiked ? 'Unlike post' : 'Like post'}
          >
            <HeartIcon 
              className={`
                h-5 w-5
                transition-all duration-300 ease-in-out
                group-hover:scale-125
                ${isLiked 
                    ? 'fill-current' 
                    : 'group-hover:fill-current'
                }
                ${isAnimating ? 'scale-[1.75]' : ''}
              `}
            />
            <span className="text-sm font-semibold">{post.likeCount}</span>
          </button>
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1.5 hover:text-indigo-500 group focus:outline-none"
          >
            <CommentIcon className="h-5 w-5 transition-transform duration-200 ease-in-out group-hover:scale-110"/>
            <span className="text-sm font-semibold">{post.comments.length}</span>
          </button>
        </div>
      </div>

      {showComments && (
        <div className="p-5 border-t border-slate-200 dark:border-slate-700">
          <div className="space-y-4">
            {post.comments.map(comment => (
              <Comment key={comment.id} comment={comment} users={users} onSelectUser={onSelectUser} />
            ))}
          </div>
          
          <form onSubmit={handleCommentSubmit} className="mt-4 flex items-start space-x-3">
            <img 
              src={currentUser.avatarUrl} 
              alt={currentUser.name} 
              className="h-9 w-9 rounded-full"
            />
            <div className="flex-grow">
               <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full text-sm p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200"
              />
            </div>
            <button type="submit" className="text-sm px-3 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition" disabled={!commentText.trim()}>
              Reply
            </button>
          </form>
        </div>
      )}
    </article>
  );
};

export default PostCard;
