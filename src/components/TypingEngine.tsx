import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Lesson } from '../data/lessons';
import VirtualKeyboard from './VirtualKeyboard';
import { Play, RotateCcw, Activity, Target, Timer, AlertTriangle, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { playSound } from '../lib/sound';

export const formatKeyDisplay = (char: string) => {
  if (char === '&') return 'Shift+7';
  if (char === '|') return 'Shift+\\';
  if (char === '\\') return '\\';
  if (char === ' ') return 'Space';
  if (char >= 'A' && char <= 'Z') return `Shift+${char}`;
  return char.toUpperCase();
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
  const fullTextObject = lesson.words.flatMap((word, i) => {
    const chars = word.keys.split('').map(k => ({ expected: k, label: '' }));
    if (i < lesson.words.length - 1) {
      chars.push({ expected: ' ', label: ' ' });
    }
    return chars;
  });

  const fullKeysString = fullTextObject.map(c => c.expected).join('');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedInputs, setTypedInputs] = useState<('correct' | 'wrong' | null)[]>(new Array(fullKeysString.length).fill(null));
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0); // Keeps track of passing seconds
  const [errors, setErrors] = useState(0);
  const [errorKeys, setErrorKeys] = useState<Record<string, number>>({});
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 100, cpm: 0 });

  const [inputValue, setInputValue] = useState('');
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isFinished) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    
    // Ignore meta/actions entirely so they don't increment errors
    if (['Shift', 'CapsLock', 'Control', 'Alt', 'Meta', 'Tab', 'Enter', 'Escape', 'Backspace'].includes(e.key)) {
      if (e.key === 'Shift') {
        setPressedKey(`Shift_${e.location === 1 ? 'L' : 'R'}`);
        setTimeout(() => setPressedKey(null), 100);
      }
      return;
    }
    
    e.preventDefault();

    // Map physical keys natively for Bijoy handling isolation
    const codeToChar: Record<string, string> = {
      KeyA: 'a', KeyB: 'b', KeyC: 'c', KeyD: 'd', KeyE: 'e', KeyF: 'f', KeyG: 'g', KeyH: 'h', KeyI: 'i', KeyJ: 'j', KeyK: 'k', KeyL: 'l', KeyM: 'm', KeyN: 'n', KeyO: 'o', KeyP: 'p', KeyQ: 'q', KeyR: 'r', KeyS: 's', KeyT: 't', KeyU: 'u', KeyV: 'v', KeyW: 'w', KeyX: 'x', KeyY: 'y', KeyZ: 'z',
      Digit1: '1', Digit2: '2', Digit3: '3', Digit4: '4', Digit5: '5', Digit6: '6', Digit7: '7', Digit8: '8', Digit9: '9', Digit0: '0',
      Minus: '-', Equal: '=', BracketLeft: '[', BracketRight: ']', Backslash: '\\', Semicolon: ';', Quote: "'", Comma: ',', Period: '.', Slash: '/', Backquote: '`', Space: ' '
    };
    const shiftMap: Record<string, string> = {
      '`': '~', '1': '!', '2': '@', '3': '#', '4': '$', '5': '%', '6': '^', '7': '&', '8': '*', '9': '(', '0': ')',
      '-': '_', '=': '+', '[': '{', ']': '}', '\\': '|', ';': ':', "'": '"', ',': '<', '.': '>', '/': '?'
    };

    let baseChar = codeToChar[e.code];
    let typedChar = e.key;

    if (baseChar) {
       typedChar = e.shiftKey ? (shiftMap[baseChar] || baseChar.toUpperCase()) : baseChar;
    }

    handleKeyInput(typedChar);
  };

  const handleKeyInput = (typedChar: string) => {
    if (isFinished) return;
    if (!startTime) setStartTime(Date.now());
    if (typedChar === 'Space') typedChar = ' ';

    setPressedKey(typedChar);

    const expectedChar = fullKeysString[currentIndex];

    if (typedChar === expectedChar) {
      playSound('correct', soundEnabled);
      setTypedInputs(prev => {
        const next = [...prev];
        next[currentIndex] = 'correct';
        return next;
      });
      
      if (typedChar === ' ') {
        setInputValue('');
      }

      if (typedChar === ' ') {
        setInputValue('');
      }

      if (currentIndex + 1 >= fullKeysString.length) {
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
    // Reverse simple mapping if they output proper bangla keys
    const nativeMap: Record<string, string> = {
      'অ': 'F', 'আ': 'f', 'ি': 'd', 'ী': 'D', 'ু': 's', 'ূ': 'S', 'ৃ': 'a', 'ে': 'c', 'ৈ': 'C', 'ো': 'x', 'ৌ': 'X',
      'ক': 'j', 'খ': 'J', 'গ': 'o', 'ঘ': 'O', 'ঙ': 'q', 'চ': 'y', 'ছ': 'Y', 'জ': 'u', 'ঝ': 'U', 'ঞ': 'I',
      'ট': 't', 'ঠ': 'T', 'ড': 'e', 'ঢ': 'E', 'ণ': 'B', 'ত': 'k', 'থ': 'K', 'দ': 'l', 'ধ': 'L', 'ন': 'b',
      'প': 'r', 'ফ': 'R', 'ব': 'h', 'ভ': 'H', 'ম': 'm', 'য': 'w', 'র': 'v', 'ল': 'V', 'শ': 'M', 'ষ': 'N', 'স': 'n', 'হ': 'i',
      'ড়': 'p', 'ঢ়': 'P', 'ব়': 'W', 'য়': '&', 'ৎ': '\\', 'ং': '|', 'ঃ': 'Z', 'ঁ': 'Q', '্': 'z', '।': 'G'
    };
    return nativeMap[char] || char;
  };

  const reset = () => {
    setCurrentIndex(0);
    setTypedInputs(new Array(fullKeysString.length).fill(null));
    setStartTime(null);
    setCurrentTime(0);
    setErrors(0);
    setErrorKeys({});
    setIsFinished(false);
    setStats({ wpm: 0, accuracy: 100, cpm: 0 });
    setInputValue('');
    setCharFails({});
    inputRef.current?.focus();
  };

  let accumulatedKeys = 0;
  let activeWordIndex = 0;
  for (let i = 0; i < lesson.words.length; i++) {
    const wordKeyCount = lesson.words[i].keys.length;
    if (currentIndex >= accumulatedKeys && currentIndex <= accumulatedKeys + wordKeyCount) {
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

  const expectedChar = fullKeysString[currentIndex];
  const isTypingSpace = expectedChar === ' ';
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
          {/* Middle 30% - Character View */}
          <div className="h-[30dvh] flex flex-col items-center justify-center bg-transparent shrink-0 relative px-4 text-center">
             <div className="text-sm font-bold text-slate-500 mb-2 font-sans tracking-widest uppercase">{groupTotal > 1 ? `${groupIndex} / ${groupTotal}` : 'Let\'s Start'}</div>
             <div className={cn("mb-4 drop-shadow-sm transition-all duration-200 font-serif", "text-7xl sm:text-9xl text-slate-800 dark:text-slate-100")}>
                 {isTypingSpace ? (
                   <span className="text-slate-300 dark:text-slate-700 italic text-5xl sm:text-7xl">(Space)</span>
                 ) : currentWord?.bangla}
             </div>
             {/* Hint Area */}
             <div className="flex flex-col items-center min-h-[60px]">
                 <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 text-xl sm:text-2xl font-mono px-6 py-2 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm transition-all duration-300 min-w-[200px] text-center font-bold tracking-widest">
                    {isTypingSpace ? "Space bar" : (
                       currentWord?.keys.split('').map((char, i) => (
                         <React.Fragment key={i}>
                           {i > 0 && <span className="opacity-50 mx-1">→</span>}
                           <span>{formatKeyDisplay(char)}</span>
                         </React.Fragment>
                       ))
                    )}
                 </div>
                 {(fails >= 1) && (
                    <div className={cn("mt-2 text-xs sm:text-sm font-sans px-3 py-1 rounded-full transition-colors font-bold", fails >= 3 ? "text-red-700 bg-red-100 dark:bg-red-900/40 dark:text-red-300 animate-pulse" : "text-amber-700 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300")}>
                       {fails >= 3 ? "সঠিক কম্বিনেশন ব্যবহার করুন" : fails >= 2 ? "কীবোর্ডে হাইলাইট করা আছে" : "ভুল হয়েছে, আবার চেষ্টা করুন"}
                    </div>
                 )}
             </div>
          </div>

          {/* Typing Box 15% */}
          <div className="h-[15dvh] flex items-center justify-center p-2 sm:p-4 bg-transparent shrink-0">
             <input 
                ref={inputRef}
                type="text" 
                autoFocus
                value={inputValue}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length > inputValue.length) {
                    const addedChar = val.slice(-1);
                    handleKeyInput(getQwertyChar(addedChar));
                    setInputValue(val);
                  } else {
                    setInputValue(val);
                  }
                }}
                onKeyDown={handleKeyDown}
                className="w-full max-w-sm text-center text-3xl sm:text-4xl font-serif py-3 sm:py-4 rounded-xl border border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-inner"
                placeholder="টাইপ করুন..."
              />
          </div>

          {/* Keyboard 35% */}
          <div className="flex-1 w-full flex items-end justify-center pb-2 sm:pb-4 bg-slate-100 dark:bg-slate-950 overflow-hidden shrink-0 shadow-[inset_0_10px_20px_-10px_rgba(0,0,0,0.05)] pt-2 border-t border-slate-200 dark:border-slate-800">
             <div className="w-full h-full max-w-5xl mx-auto overflow-x-auto overflow-y-hidden flex items-end justify-center px-1 transform origin-bottom scale-[0.85] sm:scale-100">
               <VirtualKeyboard 
                 expectedKey={(fails >= 2) ? fullKeysString[currentIndex] : null} 
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
