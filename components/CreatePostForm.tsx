
import React, { useState } from 'react';
import type { User } from '../types';

interface CreatePostFormProps {
  currentUser: User;
  onAddPost: (content: string) => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ currentUser, onAddPost }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAddPost(content);
      setContent('');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
      <form onSubmit={handleSubmit} className="flex items-start space-x-4">
        <img 
          src={currentUser.avatarUrl} 
          alt={currentUser.name} 
          className="h-12 w-12 rounded-full flex-shrink-0"
        />
        <div className="flex-grow">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200 resize-none"
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
            >
              Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;
