import { useCallback, useRef } from 'react';

export function useSwipeNavigation({ goToNext, goToPrevious }) {
  const threshold = 50;
  const touchStartXRef = useRef(0);

  const handleTouchStart = useCallback((e) => {
    touchStartXRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartXRef.current - touchEndX;

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          goToNext();
        } else {
          goToPrevious();
        }
      }
    },
    [goToNext, goToPrevious]
  );

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  };
}