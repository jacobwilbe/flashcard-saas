import React from 'react';
import { Clock, Book, ArrowRight } from 'lucide-react';

export function FlashcardGrid({ flashcards, onCardClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {flashcards.map((flashcard, index) => (
        <div
          key={index}
          onClick={() => onCardClick(flashcard.name)}
          className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {flashcard.name}
              </h3>
              <div className="flex items-center gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1">
                  <Book className="w-4 h-4" />
                  {flashcard.cards?.length || 0} cards
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Last studied 2d ago
                </span>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-6 right-6 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <ArrowRight className="w-5 h-5 text-indigo-400" />
          </div>
        </div>
      ))}
    </div>
  );
}