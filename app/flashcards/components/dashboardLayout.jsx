import React from 'react';
import { LayoutGrid, Plus, BookOpen } from 'lucide-react';

export function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-black/20 backdrop-blur-lg border-r border-white/10">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            FlashStudy
          </h1>
        </div>
        <nav className="mt-6">
          <a
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3 text-white/80 hover:bg-white/10 border-l-4 border-indigo-500"
          >
            <LayoutGrid className="w-5 h-5" />
            Dashboard
          </a>
          <a
            href="/generate"
            className="flex items-center gap-2 px-6 py-3 text-white/60 hover:bg-white/10 hover:text-white border-l-4 border-transparent"
          >
            <Plus className="w-5 h-5" />
            Create New
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64">
        {children}
      </main>
    </div>
  );
}