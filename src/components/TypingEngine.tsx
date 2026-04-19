import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Lesson } from '../data/lessons';
import VirtualKeyboard from './VirtualKeyboard';
import { Play, RotateCcw, Activity, Target, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

export interface TypingEngineProps {
  key?: React.Key;
  lesson: Lesson;
  onComplete: (stats: { wpm: number; accuracy: number; cpm: number; errorKeys: Record<string, number> }) => void;
}

export default function TypingEngine({ lesson, onComplete }: TypingEngineProps) {
  // Convert lesson words into a single typing sequence.
  // We'll pad sequences with spaces between words.
  const fullTextObject = lesson.words.flatMap((word, i) => {
    const chars = word.keys.split('').map(k => ({ expected: k, label: '' }));
    // Just mapping actual keystrokes. Bangla word is shown differently.
    if (i < lesson.words.length - 1) {
      chars.push({ expected: ' ', label: ' ' });
    }
    return chars;
  });

  const fullKeysString = fullTextObject.map(c => c.expected).join('');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedInputs, setTypedInputs] = useState<('correct' | 'wrong')[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [errorKeys, setErrorKeys] = useState<Record<string, number>>({});
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 100, cpm: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, [lesson]);

  const calculateStats = useCallback((endTime = Date.now()) => {
    if (!startTime) return { wpm: 0, accuracy: 100, cpm: 0 };
    const timeMins = (endTime - startTime) / 60000;
    const typedChars = currentIndex;
    const grossWpm = (typedChars / 5) / timeMins;
    const netWpm = Math.max(0, grossWpm - (errors / timeMins));
    const accuracyLog = typedChars === 0 ? 100 : ((typedChars - errors) / typedChars) * 100;
    
    return {
      wpm: Math.round(netWpm),
      accuracy: Number(Math.max(0, accuracyLog).toFixed(1)),
      cpm: Math.round(typedChars / timeMins)
    };
  }, [startTime, currentIndex, errors]);

  useEffect(() => {
    if (startTime && !isFinished) {
      const interval = setInterval(() => {
        setStats(calculateStats());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, isFinished, calculateStats]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isFinished) return;
    
    // Ignore meta keys
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'Shift' || e.key === 'Caps Lock') {
      setPressedKey(`Shift_${e.location === 1 ? 'L' : 'R'}`);
      return;
    }

    e.preventDefault();
    if (!startTime) setStartTime(Date.now());

    let typedChar = e.key;

    setPressedKey(e.key);

    const expectedChar = fullKeysString[currentIndex];

    if (typedChar === expectedChar) {
      setTypedInputs(prev => [...prev, 'correct']);
      if (currentIndex + 1 >= fullKeysString.length) {
        setIsFinished(true);
        const finalStats = calculateStats(Date.now());
        setStats(finalStats);
        onComplete({ ...finalStats, errorKeys });
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    } else {
      setTypedInputs(prev => [...prev, 'wrong']);
      setErrors(prev => prev + 1);
      setErrorKeys(prev => ({ ...prev, [expectedChar]: (prev[expectedChar] || 0) + 1 }));
    }
    
    setTimeout(() => setPressedKey(null), 100);
  };

  const reset = () => {
    setCurrentIndex(0);
    setTypedInputs([]);
    setStartTime(null);
    setErrors(0);
    setErrorKeys({});
    setIsFinished(false);
    setStats({ wpm: 0, accuracy: 100, cpm: 0 });
    containerRef.current?.focus();
  };

  // Determine which bangla word is currently being typed
  let accumulatedKeys = 0;
  let activeWordIndex = 0;
  for (let i = 0; i < lesson.words.length; i++) {
    const wordKeyCount = lesson.words[i].keys.length;
    if (currentIndex >= accumulatedKeys && currentIndex <= accumulatedKeys + wordKeyCount) {
      activeWordIndex = i;
      break;
    }
    accumulatedKeys += wordKeyCount + 1; // +1 for space
  }

  return (
    <div 
      className="flex flex-col gap-[24px] w-full max-w-[1024px] mx-auto focus:outline-none" 
      onKeyDown={handleKeyDown} 
      tabIndex={0}
      ref={containerRef}
    >
      <div className="flex justify-between items-center mb-[-8px]">
        <div>
          <h2 className="text-xl font-bold font-sans text-[#1e293b]">{lesson.title}</h2>
          <p className="text-sm text-[#64748b]">{lesson.description}</p>
        </div>
        <button 
          onClick={reset}
          className="p-[12px] bg-[#eff6ff] hover:bg-[#bfdbfe] text-[#2563eb] rounded-xl transition-colors cursor-pointer border border-[#bfdbfe]"
          title="Restart Lesson"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-[20px]">
        <StatBox label="WPM" value={stats.wpm} />
        <StatBox label="Accuracy" value={`${stats.accuracy}%`} />
        <StatBox label="Errors" value={errors} />
        <StatBox label="Time (s)" value={startTime ? Math.floor((Date.now() - startTime) / 1000) : "0"} />
      </div>

      <div className="bg-[#ffffff] flex-1 flex flex-col justify-center rounded-[16px] border border-[#e2e8f0] p-[40px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] relative min-h-[300px] overflow-hidden">
        {!startTime && !isFinished && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <Play className="w-16 h-16 text-[#10b981] mb-4 animate-pulse" />
            <p className="text-xl font-medium text-[#1e293b]">Start typing to begin</p>
          </div>
        )}
        
        {isFinished && (
          <div className="absolute inset-0 bg-[#eff6ff] z-20 flex flex-col items-center justify-center p-8 text-center border-t border-[#bfdbfe]">
            <h3 className="text-3xl font-bold text-[#1e40af] mb-2">Lesson Complete!</h3>
            <p className="text-[#1e3a8a] font-medium mb-8">Great job! Here are your results:</p>
            <div className="flex gap-8 mb-8">
              <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-[#bfdbfe]">
                <span className="text-sm text-[#64748b] uppercase tracking-widest font-bold">WPM</span>
                <span className="text-5xl font-black text-[#2563eb]">{stats.wpm}</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-[#bfdbfe]">
                <span className="text-sm text-[#64748b] uppercase tracking-widest font-bold">Accuracy</span>
                <span className="text-5xl font-black text-[#2563eb]">{stats.accuracy}%</span>
              </div>
            </div>
            {Object.keys(errorKeys).length > 0 && (
              <div className="mb-6">
                <span className="text-[#64748b] font-medium block mb-2">Weak Keys to Review:</span>
                <div className="flex gap-2 justify-center">
                  {Object.entries(errorKeys)
                    .sort(([,a], [,b]) => Number(b) - Number(a))
                    .slice(0, 5)
                    .map(([key, count]) => (
                    <span key={key} className="px-3 py-1 bg-[#fee2e2] text-[#ef4444] rounded-md font-mono font-bold text-lg">
                      {key} <span className="text-xs opacity-70 font-sans">({count} miss)</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
            <button onClick={reset} className="px-8 py-3 bg-[#2563eb] text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 cursor-pointer">
              Practice Again
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-x-8 gap-y-[24px] justify-center max-w-4xl mx-auto mb-[24px]">
          {lesson.words.map((word, wIdx) => {
            const isActive = wIdx === activeWordIndex;
            return (
              <div key={wIdx} className={cn("flex flex-col items-center transition-all", isActive ? "opacity-100" : "opacity-40")}>
                <div className="text-[32px] leading-[1.6] text-center tracking-[1px] text-[#1e293b] mb-2">{word.bangla}</div>
                <div className="flex text-2xl font-mono tracking-widest">
                  {word.keys.split('').map((char, cIdx) => {
                    // Compute absolute index for this char
                    let absIdx = 0;
                    for (let i = 0; i < wIdx; i++) absIdx += lesson.words[i].keys.length + 1;
                    absIdx += cIdx;

                    const status = typedInputs[absIdx];
                    const isCurrent = absIdx === currentIndex;

                    return (
                      <span 
                        key={cIdx} 
                        className={cn(
                          "relative px-1 transition-colors leading-[1.6]",
                          status === 'correct' ? "text-[#10b981]" : 
                          status === 'wrong' ? "bg-[#ef4444] text-white rounded-[2px]" : "text-[#64748b]",
                          isCurrent && "border-b-[3px] border-[#2563eb] text-[#1e293b]"
                        )}
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full h-[60px] bg-[#f8fafc] border-[2px] border-[#e2e8f0] rounded-[12px] flex items-center justify-center text-[24px] text-[#2563eb] font-medium tracking-[2px] shadow-inner mb-[24px] opacity-70">
           {lesson.words[activeWordIndex]?.keys}
        </div>
      </div>

      <VirtualKeyboard 
        expectedKey={!isFinished ? fullKeysString[currentIndex] : null} 
        pressedKey={pressedKey} 
      />

      <div className="bg-[#eff6ff] border border-[#bfdbfe] px-[20px] py-[12px] rounded-[8px] text-[13px] text-[#1e40af] text-center max-w-fit mx-auto mt-[-8px]">
        <strong>Tip:</strong> Press numbers and modifiers logically to reach combined characters. Keep your hands on the home row!
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="bg-[#ffffff] p-[16px] rounded-[12px] border border-[#e2e8f0] text-center shadow-sm">
      <span className="text-[24px] font-bold text-[#1e293b] block leading-none">{value}</span>
      <span className="text-[11px] uppercase tracking-[1px] text-[#64748b] mt-[4px] block">{label}</span>
    </div>
  );
}
