
import { useCallback } from 'react';

export const useFisherYatesShuffle = <T,>() => {
  const shuffle = useCallback((array: T[]): T[] => {
    const newArray = [...array];
    let currentIndex = newArray.length;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [newArray[currentIndex], newArray[randomIndex]] = [
        newArray[randomIndex], newArray[currentIndex]
      ];
    }
    return newArray;
  }, []);

  return shuffle;
};
