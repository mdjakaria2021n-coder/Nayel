import { useState, useEffect } from 'react';

export interface SessionResult {
  date: string;
  wpm: number;
  accuracy: number;
  mode: string;
  lessonId: number;
}

export function useProgress() {
  const [history, setHistory] = useState<SessionResult[]>([]);
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);

  useEffect(() => {
    const stored = localStorage.getItem('bijoy_progress');
    const storedLevel = localStorage.getItem('bijoy_unlocked_level');
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
    if (storedLevel) {
      setUnlockedLevel(Number(storedLevel) || 1);
    }
  }, []);

  const saveResult = (result: Omit<SessionResult, 'date'>) => {
    const newResult = { ...result, date: new Date().toISOString() };
    const newHistory = [...history, newResult];
    setHistory(newHistory);
    localStorage.setItem('bijoy_progress', JSON.stringify(newHistory));

    if (result.lessonId >= unlockedLevel && result.accuracy > 90) {
      const nextLevel = result.lessonId + 1;
      setUnlockedLevel(nextLevel);
      localStorage.setItem('bijoy_unlocked_level', nextLevel.toString());
    }
  };

  const maxWpm = history.length > 0 ? Math.max(...history.map(h => h.wpm)) : 0;

  return { history, saveResult, maxWpm, unlockedLevel };
}
