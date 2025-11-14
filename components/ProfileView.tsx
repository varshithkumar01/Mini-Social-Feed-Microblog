
import React from 'react';
import type { User } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface ProfileViewProps {
  user: User;
  onBack: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onBack }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md mb-8 relative">
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        aria-label="Back to feed"
      >
        <ArrowLeftIcon className="h-6 w-6" />
      </button>
      <div className="flex flex-col items-center pt-8">
        <img 
          src={user.avatarUrl} 
          alt={user.name} 
          className="h-24 w-24 rounded-full ring-4 ring-indigo-500/50"
        />
        <h2 className="mt-4 text-2xl font-bold text-slate-800 dark:text-slate-100">{user.name}</h2>
        <p className="text-md text-slate-500 dark:text-slate-400">@{user.username}</p>
        <p className="mt-4 text-center text-slate-600 dark:text-slate-300 max-w-md">
          Posts by {user.name}. This is a simulated profile page. In a real app, this would contain a user bio and other details.
        </p>
      </div>
    </div>
  );
};

export default ProfileView;
