
import { useState, useEffect, useCallback } from 'react';
import { User, Post, Comment } from '../types';
import { generateInitialFeed } from '../services/geminiService';

export const useFeedData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        const { users: fetchedUsers, posts: fetchedPosts } = await generateInitialFeed();
        
        // Sort posts by timestamp, newest first
        const sortedPosts = fetchedPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        setUsers(fetchedUsers);
        setPosts(sortedPosts);
        
        // Set the first user as the "current" logged-in user for simulation
        if (fetchedUsers.length > 0) {
          setCurrentUser(fetchedUsers[0]);
        }
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const addPost = useCallback((content: string) => {
    if (!currentUser) return;

    const newPost: Post = {
      id: crypto.randomUUID(),
      authorId: currentUser.id,
      content,
      timestamp: new Date().toISOString(),
      likeCount: 0,
      likedBy: [],
      comments: [],
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
  }, [currentUser]);

  const toggleLike = useCallback((postId: string) => {
    if (!currentUser) return;

    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const isLiked = post.likedBy.includes(currentUser.id);
          if (isLiked) {
            return {
              ...post,
              likeCount: post.likeCount - 1,
              likedBy: post.likedBy.filter(id => id !== currentUser.id),
            };
          } else {
            return {
              ...post,
              likeCount: post.likeCount + 1,
              likedBy: [...post.likedBy, currentUser.id],
            };
          }
        }
        return post;
      })
    );
  }, [currentUser]);

  const addComment = useCallback((postId: string, text: string) => {
    if (!currentUser) return;

    const newComment: Comment = {
      id: crypto.randomUUID(),
      authorId: currentUser.id,
      text,
      timestamp: new Date().toISOString(),
    };

    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );
  }, [currentUser]);

  return {
    users,
    posts,
    currentUser,
    loading,
    error,
    actions: {
      addPost,
      toggleLike,
      addComment,
    },
  };
};
