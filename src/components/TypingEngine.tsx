import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Lesson } from '../data/lessons';
import VirtualKeyboard from './VirtualKeyboard';
import { Play, RotateCcw, Activity, Target, Timer, AlertTriangle, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { playSound } from '../lib/sound';
import { getWordKeysArray } from '../lib/bijoy-mapping';

export const formatKeyDisplay = (char: string) => {
  return char; // Output exactly the mapped key (e.g., 'Shift+F', 'J', 'G')
};

export interface TypingEngineProps {
  key?: React.Key;
  lesson: Lesson;
  mode?: 'practice' | 'exam' | 'challenge';
  soundEnabled?: boolean;
  onComplete?: (stats: { wpm: number; accuracy: number; cpm: number; errorKeys: Record<string, number> }) => void;
  onNextLesson?: () => void;
  onBack?: () => void;
}

export default function TypingEngine({ lesson, mode = 'practice', soundEnabled = true, onComplete, onNextLesson, onBack }: TypingEngineProps) {
  const expectedKeysSequence = lesson.words.flatMap((word, i) => {
    let keys = getWordKeysArray(word.bangla);
    // filter out any unexpected spaces inside word
    keys = keys.filter(k => k !== 'Space');
    if (i < lesson.words.length - 1) {
      return [...keys, 'Space'];
    }
    return keys;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedInputs, setTypedInputs] = useState<('correct' | 'wrong' | null)[]>(new Array(expectedKeysSequence.length).fill(null));
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0); // Keeps track of passing seconds
  const [errors, setErrors] = useState(0);
  const [errorKeys, setErrorKeys] = useState<Record<string, number>>({});
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 100, cpm: 0 });
  const [charFails, setCharFails] = useState<Record<number, number>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const EXAM_TIME_LIMIT = 5 * 60; // 5 minutes in seconds

  useEffect(() => {
    containerRef.current?.focus();
  }, [lesson, mode]);

  const [countdown, setCountdown] = useState<number | null>(null);

  const calculateStats = useCallback((durationSec: number) => {
    const timeMins = Math.max(durationSec / 60, 0.01); // avoid Infinity
    
    // Count exact correct words completed
    let correctWords = 0;
    let countedChars = 0;
    for (let i = 0; i < lesson.words.length; i++) {
        const wordLen = lesson.words[i].keys.length;
        if (currentIndex >= countedChars + wordLen) {
            correctWords++;
        }
        countedChars += wordLen + 1; // plus space
    }

    const netWpm = Math.max(0, correctWords / timeMins);
    const accuracyLog = currentIndex === 0 ? 100 : ((currentIndex - errors) / currentIndex) * 100;
    
    return {
      wpm: Math.round(netWpm),
      accuracy: Number(Math.max(0, accuracyLog).toFixed(1)),
      cpm: Math.round(currentIndex / timeMins)
    };
  }, [currentIndex, errors, lesson]);

  useEffect(() => {
    if (startTime && !isFinished) {
      const interval = setInterval(() => {
        const elapsedSec = Math.floor((Date.now() - startTime) / 1000);
        setCurrentTime(elapsedSec);
        setStats(calculateStats(elapsedSec));
        
        // Auto end Exam Mode
        if (mode === 'exam' && elapsedSec >= EXAM_TIME_LIMIT) {
          finishLesson(elapsedSec);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, isFinished, mode, calculateStats]);

  const finishLesson = (elapsedSec: number = Math.floor((Date.now() - (startTime || Date.now())) / 1000)) => {
    setIsFinished(true);
    const finalStats = calculateStats(elapsedSec);
    setStats(finalStats);
    onComplete?.({ ...finalStats, errorKeys });
    
    if (finalStats.accuracy >= 80) {
      setCountdown(3);
    }
  };

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      onNextLesson?.();
    }
  }, [countdown, onNextLesson]);

  useEffect(() => {
    const handleGlobalClick = () => {
      document.getElementById('typingInput')?.focus({ preventScroll: true });
    };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isFinished) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    
    // Ignore meta/actions entirely so they don't increment errors
    if (['Shift', 'CapsLock', 'Control', 'Alt', 'Meta', 'Tab', 'Escape'].includes(e.key)) {
      if (e.key === 'Shift') {
        setPressedKey(`Shift_${e.location === 1 ? 'L' : 'R'}`);
        setTimeout(() => setPressedKey(null), 100);
      }
      if (['Tab', 'Escape'].includes(e.key)) e.preventDefault(); // Block scroll/focus loss
      return;
    }
    
    if (e.key === 'Enter') {
      e.preventDefault(); // Enter চাপলে next word যাবে না
      return;
    }
    
    if (e.key === ' ') {
      e.preventDefault(); // scroll block করবে
    }

    if (e.key === 'Backspace') {
      // Find the start index of the current word
      let activeAccumulator = 0;
      for (let i = 0; i < lesson.words.length; i++) {
        const wordKeyCount = getWordKeysArray(lesson.words[i].bangla).filter(k => k !== 'Space').length;
        if (currentIndex >= activeAccumulator && currentIndex < activeAccumulator + wordKeyCount + 1) {
          break;
        }
        activeAccumulator += wordKeyCount + 1;
      }
      
      const correctCharsInCurrentWord = currentIndex - activeAccumulator;
      
      if (currentIndex > 0 && expectedKeysSequence[currentIndex - 1] !== 'Space') {
        setCurrentIndex(prev => prev - 1);
        setTypedInputs(prev => {
          const next = [...prev];
          next[currentIndex - 1] = null;
          return next;
        });
      }
      return;
    }

    const codeToChar: Record<string, string> = {
      KeyA: 'A', KeyB: 'B', KeyC: 'C', KeyD: 'D', KeyE: 'E', KeyF: 'F', KeyG: 'G', KeyH: 'H', KeyI: 'I', KeyJ: 'J', KeyK: 'K', KeyL: 'L', KeyM: 'M', KeyN: 'N', KeyO: 'O', KeyP: 'P', KeyQ: 'Q', KeyR: 'R', KeyS: 'S', KeyT: 'T', KeyU: 'U', KeyV: 'V', KeyW: 'W', KeyX: 'X', KeyY: 'Y', KeyZ: 'Z',
      Digit1: '1', Digit2: '2', Digit3: '3', Digit4: '4', Digit5: '5', Digit6: '6', Digit7: '7', Digit8: '8', Digit9: '9', Digit0: '0',
      Minus: '-', Equal: '=', BracketLeft: '[', BracketRight: ']', Backslash: '\\', Semicolon: ';', Quote: "'", Comma: ',', Period: '.', Slash: '/', Backquote: '`', Space: 'Space'
    };

    let baseCode = codeToChar[e.code];
    let typedChar = e.key;

    if (baseCode) {
      if (baseCode === 'Space') {
         typedChar = 'Space';
      } else {
         typedChar = e.shiftKey ? `Shift+${baseCode}` : baseCode;
      }
    } else {
       // if we can't map physical key but it's a character, we could fallback, but let's just proceed
    }

    handleKeyInput(typedChar);
  };

  const handleKeyInput = (typedChar: string) => {
    if (isFinished) return;
    if (!startTime) setStartTime(Date.now());
    
    // Safety exact matching (trim bypass)
    if (typedChar === ' ') typedChar = 'Space';

    setPressedKey(typedChar);

    const expectedChar = expectedKeysSequence[currentIndex];

    if (typedChar === expectedChar) {
      playSound('correct', soundEnabled);
      setTypedInputs(prev => {
        const next = [...prev];
        next[currentIndex] = 'correct';
        return next;
      });
      
      if (typedChar === 'Space') {
        setInputValue('');
      }

      if (currentIndex + 1 >= expectedKeysSequence.length) {
        finishLesson();
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    } else {
      playSound('wrong', soundEnabled);
      setTypedInputs(prev => {
        const next = [...prev];
        next[currentIndex] = 'wrong';
        return next;
      });
      setErrors(prev => prev + 1);
      setErrorKeys(prev => ({ ...prev, [expectedChar]: (prev[expectedChar] || 0) + 1 }));
      setCharFails(prev => ({ ...prev, [currentIndex]: (prev[currentIndex] || 0) + 1 }));
    }
    
    setTimeout(() => setPressedKey(null), 100);
  };

  const getQwertyChar = (char: string) => {
    return char;
  };

  const reset = () => {
    setCurrentIndex(0);
    setTypedInputs(new Array(expectedKeysSequence.length).fill(null));
    setStartTime(null);
    setCurrentTime(0);
    setErrors(0);
    setErrorKeys({});
    setIsFinished(false);
    setStats({ wpm: 0, accuracy: 100, cpm: 0 });
    setCountdown(null);
    setCharFails({});
    inputRef.current?.focus();
  };

  let accumulatedKeys = 0;
  let activeWordIndex = 0;
  for (let i = 0; i < lesson.words.length; i++) {
    const wordKeyCount = getWordKeysArray(lesson.words[i].bangla).filter(k => k !== 'Space').length;
    // adding 1 representing the space expected after a word
    if (currentIndex >= accumulatedKeys && currentIndex < accumulatedKeys + wordKeyCount + 1) {
      activeWordIndex = i;
      break;
    }
    accumulatedKeys += wordKeyCount + 1;
  }

  // Formatting displays
  const timeDisplay = mode === 'exam' 
    ? `${Math.floor((EXAM_TIME_LIMIT - currentTime) / 60)}:${((EXAM_TIME_LIMIT - currentTime) % 60).toString().padStart(2, '0')}` // Countdown
    : `${Math.floor(currentTime / 60)}:${(currentTime % 60).toString().padStart(2, '0')}`; // Count up

  const wpmColor = stats.wpm === 0 ? "" : stats.wpm < 10 ? "text-red-500 dark:text-red-400" : stats.wpm <= 20 ? "text-amber-500 dark:text-amber-400" : "text-green-500 dark:text-green-400";

  // Track groups for 7/10 text 
  const currentWord = lesson.words[activeWordIndex];
  let start = activeWordIndex;
  while (start > 0 && lesson.words[start - 1]?.bangla === currentWord?.bangla) start--;
  let end = activeWordIndex;
  while (end < lesson.words.length - 1 && lesson.words[end + 1]?.bangla === currentWord?.bangla) end++;

  const groupTotal = end - start + 1;
  const groupIndex = activeWordIndex - start + 1;

  const expectedChar = expectedKeysSequence[currentIndex];
  const isTypingSpace = expectedChar === 'Space';
  const fails = charFails[currentIndex] || 0;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-900 flex flex-col h-[100dvh] w-screen overflow-hidden font-serif" 
      onClick={() => inputRef.current?.focus()}
    >
      {/* Top 20% - Stats */}
      <div className="h-[20dvh] min-h-[120px] max-h-[160px] flex flex-col justify-center px-2 sm:px-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <button onClick={onBack} className="p-2 sm:px-4 sm:py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 font-sans flex items-center gap-2 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all font-bold">
            <ArrowLeft size={16}/> <span className="hidden sm:inline">Back</span>
          </button>
          <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg sm:text-xl text-center truncate px-2 font-serif flex items-center justify-center gap-2">{lesson.title}
             <span className={cn(
              "px-2 py-0.5 rounded text-xs font-bold uppercase",
              mode === 'exam' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
              mode === 'challenge' ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
              "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            )}>
              {mode === 'exam' ? 'Exam' : mode === 'challenge' ? 'Challenge' : 'Practice'}
            </span>
          </h2>
          <button onClick={reset} className="p-2 sm:px-4 sm:py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-blue-500 font-sans flex items-center gap-2 border border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-all font-bold">
             <RotateCcw size={16} /> <span className="hidden sm:inline">Restart</span>
          </button>
        </div>
        <div className="flex gap-2 sm:gap-4 max-w-4xl mx-auto w-full items-center justify-center">
          <StatBox label="WPM" value={stats.wpm} valueClassName={wpmColor} />
          <StatBox label="Accuracy" value={`${stats.accuracy}%`} />
          <StatBox label="Errors" value={errors} alert={errors > 0} />
          <StatBox label="Time" value={timeDisplay} alert={mode === 'exam' && EXAM_TIME_LIMIT - currentTime <= 60} />
        </div>
      </div>

      {!isFinished ? (
        <>
          {/* Middle 35% - Character View */}
          <div className="h-[35dvh] flex flex-col items-center justify-center bg-transparent shrink-0 relative px-4 text-center">
             <div className="text-sm font-bold text-slate-500 mb-1 sm:mb-2 font-sans tracking-widest uppercase">{groupTotal > 1 ? `${groupIndex} / ${groupTotal}` : 'Let\'s Start'}</div>
             <div className={cn("mb-2 sm:mb-4 drop-shadow-sm transition-all duration-200 font-serif", "text-6xl sm:text-8xl text-slate-800 dark:text-slate-100")}>
                 {isTypingSpace ? (
                   <span className="text-slate-300 dark:text-slate-700 italic text-5xl sm:text-7xl">(Space)</span>
                 ) : currentWord?.bangla}
             </div>
             
             {/* Paragraph Context View */}
             <div className="w-full max-w-4xl px-2 mb-2 sm:mb-4 flex flex-wrap justify-center gap-x-1 sm:gap-x-2 gap-y-1 sm:gap-y-2 text-base sm:text-xl font-serif leading-relaxed max-h-[100px] sm:max-h-[120px] overflow-hidden items-end">
                {(() => {
                   // Show few words before and after
                   const windowStart = Math.max(0, activeWordIndex - 6);
                   const windowEnd = Math.min(lesson.words.length, activeWordIndex + 8);
                   const words = lesson.words.slice(windowStart, windowEnd);
                   return (
                     <>
                        {windowStart > 0 && <span className="text-slate-400 py-1">...</span>}
                        {words.map((w, localIdx) => {
                           const actualIdx = windowStart + localIdx;
                           const isCurrent = actualIdx === activeWordIndex;
                           return (
                             <span key={actualIdx} className={cn(
                               "transition-all duration-200 px-2 py-0.5 rounded-md flex items-center gap-1",
                               actualIdx < activeWordIndex ? "text-emerald-500/60 dark:text-emerald-500/50" :
                               isCurrent ? "text-blue-700 dark:text-blue-300 font-bold bg-blue-100 dark:bg-blue-900/40 shadow-sm transform scale-110" :
                               "text-slate-600 dark:text-slate-400"
                             )}>
                               <span>{w.bangla}</span>
                               <span className={cn(
                                 "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-opacity",
                                 (isCurrent && isTypingSpace) ? "bg-blue-500 animate-pulse opacity-100" : "opacity-0 invisible"
                               )} />
                             </span>
                           );
                        })}
                        {windowEnd < lesson.words.length && <span className="text-slate-400 py-1">...</span>}
                     </>
                   );
                })()}
             </div>

             {/* Hint Area */}
             <div className="flex flex-col items-center min-h-[50px] sm:min-h-[60px]">
                 <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 text-lg sm:text-xl font-mono px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm transition-all duration-300 min-w-[150px] sm:min-w-[200px] text-center font-bold tracking-widest">
                    {isTypingSpace ? "Space bar" : (
                       currentWord?.bangla ? getWordKeysArray(currentWord.bangla).filter(k => k !== 'Space').map((char, i) => (
                         <React.Fragment key={i}>
                           {i > 0 && <span className="opacity-50 mx-1">→</span>}
                           <span>{char}</span>
                         </React.Fragment>
                       )) : null
                    )}
                 </div>
                 {(fails >= 1) && (
                    <div className={cn("mt-2 text-xs font-sans px-3 py-1 rounded-full transition-colors font-bold", fails >= 3 ? "text-red-700 bg-red-100 dark:bg-red-900/40 dark:text-red-300 animate-pulse" : "text-amber-700 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300")}>
                       {fails >= 3 ? "সঠিক কম্বিনেশন ব্যবহার করুন" : fails >= 2 ? "কীবোর্ডে হাইলাইট করা আছে" : "ভুল হয়েছে, আবার চেষ্টা করুন"}
                    </div>
                 )}
             </div>
          </div>

          {/* Typing Box 10% */}
          <div className="h-[10dvh] flex items-center justify-center p-2 sm:p-4 bg-transparent shrink-0">
             <div className="relative w-full max-w-sm">
               <input 
                  id="typingInput"
                  ref={inputRef}
                  type="text" 
                  autoFocus
                  readOnly
                  value=""
                  onKeyDown={handleKeyDown}
                  className="absolute inset-0 w-full text-center text-3xl sm:text-4xl font-serif py-3 sm:py-4 rounded-xl border border-transparent bg-transparent outline-none text-transparent z-10 cursor-default"
                  placeholder=""
                />
                <div className="w-full text-center text-3xl sm:text-4xl font-mono py-3 sm:py-4 rounded-xl border border-slate-300 dark:border-slate-600 outline-none bg-white dark:bg-slate-800 shadow-inner flex items-center justify-center gap-2 overflow-hidden h-[60px] sm:h-[76px] transition-colors"
                  style={{
                    backgroundColor: typedInputs[currentIndex - 1] === 'wrong' ? 'rgb(254 226 226)' : undefined // red-100 fallback for flash
                  }}
                >
                  {expectedKeysSequence.slice(
                     (() => {
                       let activeAccumulator = 0;
                       for (let i = 0; i < lesson.words.length; i++) {
                         const wordKeyCount = getWordKeysArray(lesson.words[i].bangla).filter(k => k !== 'Space').length;
                         if (currentIndex >= activeAccumulator && currentIndex < activeAccumulator + wordKeyCount + 1) {
                           break;
                         }
                         activeAccumulator += wordKeyCount + 1;
                       }
                       return activeAccumulator;
                     })(),
                     (() => {
                        let activeAccumulator = 0;
                        for (let i = 0; i < lesson.words.length; i++) {
                          const wordKeyCount = getWordKeysArray(lesson.words[i].bangla).filter(k => k !== 'Space').length;
                          if (currentIndex >= activeAccumulator && currentIndex < activeAccumulator + wordKeyCount + 1) {
                            return activeAccumulator + wordKeyCount;
                          }
                          activeAccumulator += wordKeyCount + 1;
                        }
                        return activeAccumulator;
                     })()
                  ).map((keyStr, localIdx) => {
                     const globalIdx = (() => {
                       let activeAccumulator = 0;
                       for (let i = 0; i < lesson.words.length; i++) {
                         const wordKeyCount = getWordKeysArray(lesson.words[i].bangla).filter(k => k !== 'Space').length;
                         if (currentIndex >= activeAccumulator && currentIndex < activeAccumulator + wordKeyCount + 1) {
                           break;
                         }
                         activeAccumulator += wordKeyCount + 1;
                       }
                       return activeAccumulator;
                     })() + localIdx;

                     const status = typedInputs[globalIdx];
                     const isCurrent = globalIdx === currentIndex;

                     return (
                        <div key={globalIdx} className={cn(
                          "w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-all duration-200",
                          status === 'correct' ? "bg-emerald-500 scale-100" :
                          status === 'wrong' ? "bg-red-500 scale-100" :
                          isCurrent ? "bg-blue-400 scale-125 animate-pulse" :
                          "bg-slate-200 dark:bg-slate-700 scale-75"
                        )} />
                     );
                  })}
                  
                  {isTypingSpace && (
                      <div className="w-16 h-2 rounded-full bg-blue-400 scale-125 animate-pulse ml-2" />
                  )}
                </div>
             </div>
          </div>

          {/* Keyboard 35% */}
          <div className="flex-1 w-full flex items-end justify-center pb-2 sm:pb-4 bg-slate-100 dark:bg-slate-950 overflow-hidden shrink-0 shadow-[inset_0_10px_20px_-10px_rgba(0,0,0,0.05)] pt-2 border-t border-slate-200 dark:border-slate-800">
             <div className="w-full h-full max-w-5xl mx-auto overflow-x-auto overflow-y-hidden flex items-end justify-center px-1 transform origin-bottom scale-[0.85] sm:scale-100">
               <VirtualKeyboard 
                 expectedKey={(fails >= 2) ? expectedKeysSequence[currentIndex] : null} 
                 pressedKey={pressedKey} 
                 onKeyClick={(keyId) => {
                   if (keyId.includes('Shift')) {
                     setPressedKey(keyId);
                     setTimeout(() => setPressedKey(null), 100);
                   } else {
                     handleKeyInput(keyId);
                   }
                 }}
               />
             </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-transparent shrink-0 relative px-4 text-center mt-8">
           <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-lg mb-4 animate-in fade-in zoom-in duration-500">
             <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 font-serif">ফলাফল</h3>
             <div className="grid grid-cols-2 gap-4 mb-6">
               <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                 <div className="text-sm text-slate-500 mb-1">গতি (WPM)</div>
                 <div className="text-3xl font-bold text-blue-600">{stats.wpm}</div>
               </div>
               <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                 <div className="text-sm text-slate-500 mb-1">সঠিকতা</div>
                 <div className="text-3xl font-bold text-emerald-600">{stats.accuracy}%</div>
               </div>
               <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                 <div className="text-sm text-slate-500 mb-1">সময়</div>
                 <div className="text-3xl font-bold text-amber-600">{timeDisplay}</div>
               </div>
               <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                 <div className="text-sm text-slate-500 mb-1">ভুল কীবোর্ড</div>
                 <div className="text-2xl font-bold text-red-500 font-mono">
                    {Object.keys(errorKeys).length > 0 
                      ? formatKeyDisplay(Object.keys(errorKeys).reduce((a, b) => errorKeys[a] > errorKeys[b] ? a : b)) 
                      : 'নাই'}
                 </div>
               </div>
             </div>
             
             {stats.accuracy >= 80 ? (
               <div className="mt-4 text-lg font-bold text-emerald-700 dark:text-emerald-300 animate-pulse bg-emerald-50 dark:bg-emerald-900/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
                 পরের lesson এ যাচ্ছি {countdown}...
               </div>
             ) : (
               <div className="mt-4 flex flex-col items-center gap-4">
                 <div className="text-lg font-bold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/40 p-4 rounded-xl border border-red-200 dark:border-red-800 w-full">
                   আবার চেষ্টা করো (সঠিকতা ৮০% এর কম)
                 </div>
                 <button onClick={reset} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-colors w-full flex items-center justify-center gap-2">
                   <RotateCcw size={20} /> পুনরায় চেষ্টা করুন
                 </button>
               </div>
             )}
           </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, alert, valueClassName }: { label: string, value: string | number, alert?: boolean, valueClassName?: string }) {
  return (
    <div className={cn(
      "flex-1 min-w-0 bg-white dark:bg-slate-800 p-2 sm:p-3 rounded-lg border text-center flex flex-col items-center justify-center transition-colors shadow-sm",
      alert ? "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "border-slate-200 dark:border-slate-700"
    )}>
      <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1 truncate w-full font-serif">{label}</span>
      <span className={cn(
        "text-lg sm:text-2xl font-bold block leading-none font-serif",
        valueClassName || (alert ? "animate-pulse" : "text-slate-800 dark:text-slate-100")
      )}>
        {value}
      </span>
    </div>
  );
}
