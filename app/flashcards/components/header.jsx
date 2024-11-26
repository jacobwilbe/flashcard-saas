import React from 'react';
import { Search, Bell } from 'lucide-react';
import { SignedIn, UserButton } from '@clerk/nextjs';

export function Header() {
  return (
    <header className="bg-transparent border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search flashcards..."
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/5 rounded-lg">
              <Bell className="w-5 h-5 text-white/60" />
            </button>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}