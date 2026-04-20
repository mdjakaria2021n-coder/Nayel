import { useState, useEffect } from 'react';

export interface SessionResult {
  date: string;
  wpm: number;
  accuracy: number;
  mode: string;
}

export function useProgress() {
  const [history, setHistory] = useState<SessionResult[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('bijoy_progress');
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  const saveResult = (result: Omit<SessionResult, 'date'>) => {
    const newResult = { ...result, date: new Date().toISOString() };
    const newHistory = [...history, newResult];
    setHistory(newHistory);
    localStorage.setItem('bijoy_progress', JSON.stringify(newHistory));
  };

  const maxWpm = history.length > 0 ? Math.max(...history.map(h => h.wpm)) : 0;

  return { history, saveResult, maxWpm };
}
