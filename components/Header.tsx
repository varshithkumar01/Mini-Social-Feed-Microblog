import React from 'react';
import { NovaIcon } from './icons/NovaIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
      <div className="container mx-auto max-w-2xl px-4 py-3">
        <div className="flex items-center justify-center space-x-3">
            <NovaIcon className="h-8 w-8 text-indigo-500" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
              NovaFeed
            </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
