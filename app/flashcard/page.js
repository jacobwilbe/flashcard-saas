'use client'
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { FlashcardItem } from './components/FlashcardItem';
import { useKeyboardNavigation } from './components/useKeyBoardNavigation';
import { useSwipeNavigation } from './components/useSwipeNavigation';

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState({});
  const [testMode, setTestMode] = useState(false);
  const [answers, setAnswers] = useState({});
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [percentage, setPercentage] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const goToNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleFlip = (index) => {
    if (testMode) return;
    setFlipped(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  useKeyboardNavigation({
    goToNext,
    goToPrevious,
    handleFlip: () => handleFlip(currentIndex)
  });
  const swipeHandlers = useSwipeNavigation({ goToNext, goToPrevious });

  const handleCorrect = async (answer, back, index) => {
    const text = "Answer: " + answer + " " + "Back: " + back;
    
    try {
      const response = await fetch('/api/testMode', {
        method: 'POST',
        body: text,
      });
      const result = await response.json();
      
      setCorrectAnswers(prev => {
        const newCorrectAnswers = { ...prev, [index]: result.result === "True" };
        const correctCount = Object.values(newCorrectAnswers).filter(bool => bool === true).length;
        const totalAnswers = Object.keys(newCorrectAnswers).length;
        const newPercentage = totalAnswers > 0 ? (correctCount / totalAnswers) * 100 : 0;

        if (totalAnswers === flashcards.length) {
          setFinalScore(newPercentage);
        }

        setPercentage(Math.round(newPercentage));
        return newCorrectAnswers;
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function getFlashcard() {
      if (!id || !user) return;
      
      const docRef = doc(collection(doc(collection(db, 'users'), user.id), 'flashcardSets'), id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFlashcards(data.flashcards || []);
      }
    }
    getFlashcard();
  }, [id, user]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen text-white">
      {/* AppBar */}
      <header className="bg-white/5 border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-indigo-400" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                FlashStudy
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/generate" className="text-white/70 hover:text-white transition-colors">
                Generate
              </Link>
              <Link href="/flashcards" className="text-white/70 hover:text-white transition-colors">
                Flashcards
              </Link>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {id} Flashcards
          </h2>
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-indigo-500 rounded border-white/30 bg-white/5"
                checked={testMode}
                onChange={() => setTestMode(prev => !prev)}
              />
              <span className="text-white/70">{testMode ? "Test Mode" : "Study Mode"}</span>
            </label>
            {testMode && (
              <div className="w-20 h-20">
                <CircularProgressbar
                  value={percentage}
                  text={`${percentage}%`}
                  styles={buildStyles({
                    rotation: 0.25,
                    strokeLinecap: 'round',
                    textSize: '16px',
                    pathTransitionDuration: 0.5,
                    pathColor: `rgba(129, 140, 248, ${percentage / 100})`,
                    textColor: '#fff',
                    trailColor: 'rgba(255, 255, 255, 0.1)',
                    backgroundColor: '#3e98c7',
                  })}
                />
              </div>
            )}
          </div>
        </div>

        <div className="relative max-w-2xl mx-auto" {...swipeHandlers}>
          {flashcards.length > 0 && (
            <FlashcardItem
              front={flashcards[currentIndex].front}
              back={flashcards[currentIndex].back}
              isFlipped={flipped[currentIndex]}
              isTestMode={testMode}
              answer={answers[currentIndex] || ''}
              isCorrect={correctAnswers[currentIndex]}
              onFlip={() => handleFlip(currentIndex)}
              onAnswerChange={(value) => setAnswers(prev => ({ ...prev, [currentIndex]: value }))}
              onSubmit={() => handleCorrect(answers[currentIndex], flashcards[currentIndex].back, currentIndex)}
            />
          )}

          <div className="absolute left-0 right-0 bottom-[-140px] flex justify-center items-center gap-6">
            <button
              onClick={goToPrevious}
              className="p-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={goToNext}
              className="p-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentIndex === flashcards.length - 1}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="text-center mt-44 text-sm text-white/50">
          <p>Card {currentIndex + 1} of {flashcards.length}</p>
          <p className="mt-2">Use arrow keys to navigate • Space to flip • Swipe on touch devices</p>
        </div>

        {finalScore > 0 && (
          <div className="flex justify-center mt-8">
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200">
              View Results
            </button>
          </div>
        )}
      </main>
    </div>
  );
}