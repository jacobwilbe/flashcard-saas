'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignedIn, useUser } from '@clerk/nextjs';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { db } from '@/firebase';
import { DashboardLayout } from './components/dashboardLayout';
import { Header } from './components/header';
import { FlashcardGrid } from './components/flashcardGrid';
import { Plus } from 'lucide-react';

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards() {
      if (!user?.id) return;
      const docRef = doc(collection(db, 'users'), user.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcardSets || [];
        setFlashcards(collections);
      } else {
        await setDoc(docRef, { flashcardSets: [] });
      }
    }
    getFlashcards();
  }, [user?.id]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const handleCardClick = (name) => {
    router.push(`/flashcard?id=${name}`);
  };

  return (
    <DashboardLayout>
      <Header />
      
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Your Flashcards</h2>
            <p className="mt-1 text-white/60">
              Manage and study your flashcard collections
            </p>
          </div>
          
          <button
            onClick={() => router.push('/generate')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            Create New Set
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <h4 className="text-white/60 text-sm font-medium">Total Sets</h4>
            <p className="text-2xl font-bold text-white mt-1">{flashcards.length}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <h4 className="text-white/60 text-sm font-medium">Cards Mastered</h4>
            <p className="text-2xl font-bold text-white mt-1">0</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <h4 className="text-white/60 text-sm font-medium">Study Streak</h4>
            <p className="text-2xl font-bold text-white mt-1">0 days</p>
          </div>
        </div>

        {/* Flashcard Grid */}
        <FlashcardGrid flashcards={flashcards} onCardClick={handleCardClick} />
      </div>
    </DashboardLayout>
  );
}