
import React, { useState, useMemo } from 'react';
import { User, Post } from './types';
import { useFeedData } from './hooks/useFeedData';
import Header from './components/Header';
import CreatePostForm from './components/CreatePostForm';
import PostCard from './components/PostCard';
import ProfileView from './components/ProfileView';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const { 
    users, 
    posts, 
    currentUser, 
    loading, 
    error,
    actions 
  } = useFeedData();
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleSelectUser = (user: User | null) => {
    setSelectedUser(user);
    window.scrollTo(0, 0);
  };

  const addPost = (content: string) => {
    actions.addPost(content);
  }

  const postsForView = useMemo(() => {
    if (selectedUser) {
      return posts.filter(p => p.authorId === selectedUser.id);
    }
    return posts;
  }, [posts, selectedUser]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto max-w-2xl px-4 py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center mt-20">
            <LoadingSpinner />
            <p className="text-lg text-slate-500 dark:text-slate-400 mt-4">Generating your social feed...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
            <p className="font-bold">An error occurred</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && currentUser && (
          <>
            {selectedUser ? (
              <ProfileView user={selectedUser} onBack={() => handleSelectUser(null)} />
            ) : (
              <CreatePostForm currentUser={currentUser} onAddPost={addPost} />
            )}
            
            <div className="mt-8 space-y-6">
              {postsForView.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  users={users}
                  currentUser={currentUser}
                  onToggleLike={actions.toggleLike}
                  onAddComment={actions.addComment}
                  onSelectUser={handleSelectUser}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;
