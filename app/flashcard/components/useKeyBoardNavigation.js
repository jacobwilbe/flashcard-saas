import { useEffect } from 'react';

export function useKeyboardNavigation({ testMode, goToNext, goToPrevious, handleFlip }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if the focused element is an input, textarea, or contentEditable
      const tagName = event.target.tagName.toLowerCase();
      const isInput = tagName === 'input' || tagName === 'textarea' || event.target.isContentEditable;

      if (isInput) {
        return; // Do not handle key events when focused on input elements
      }

      switch (event.code) {
        case 'ArrowRight':
          goToNext();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'Space':
          event.preventDefault();
          handleFlip();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious, handleFlip]);
}