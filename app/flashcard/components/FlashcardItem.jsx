import React from 'react';
import './FlashcardItem.css';

export function FlashcardItem({
  front,
  back,
  isFlipped,
  isTestMode,
  answer,
  isCorrect,
  onFlip,
  onAnswerChange,
  onSubmit
}) {
  const getBorderColor = () => {
    if (!isTestMode) return 'border-indigo-300/30';
    if (isCorrect === undefined) return 'border-indigo-300/30';
    return isCorrect ? 'border-green-500' : 'border-red-500';
  };

  return (
    <div className="flashcard-container" onClick={isTestMode ? undefined : onFlip}>
      <div className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}>
        {/* Front of card */}
        <div className="flashcard-face flashcard-face-front">
          <div className={`flashcard-content border-2 ${getBorderColor()}`}>
            <p className="text-2xl font-bold text-center text-white">{front}</p>
          </div>
        </div>

        {/* Back of card */}
        <div className="flashcard-face flashcard-face-back">
          <div className={`flashcard-content border-2 ${getBorderColor()}`}>
            <p className="text-2xl font-bold text-center text-white">{back}</p>
          </div>
        </div>
      </div>

      {isTestMode && (
        <div className="absolute -bottom-24 left-0 right-0 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-indigo-300/30">
          <input
            type="text"
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/5 border border-indigo-300/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Your answer"
          />
          <button
            className="w-full mt-3 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onSubmit();
            }}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}