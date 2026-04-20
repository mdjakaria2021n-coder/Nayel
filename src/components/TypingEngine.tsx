import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Lesson } from '../data/lessons';
import VirtualKeyboard from './VirtualKeyboard';
import { Play, RotateCcw, Activity, Target, Timer, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';
import { playSound } from '../lib/sound';

export interface TypingEngineProps {
  key?: React.Key;
  lesson: Lesson;
  mode: 'practice' | 'exam' | 'challenge';
  soundEnabled: boolean;
  onComplete: (stats: { wpm: number; accuracy: number; cpm: number; errorKeys: Record<string, number> }) => void;
}

export default function TypingEngine({ lesson, mode, soundEnabled, onComplete }: TypingEngineProps) {
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

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const EXAM_TIME_LIMIT = 5 * 60; // 5 minutes in seconds

  useEffect(() => {
    containerRef.current?.focus();
  }, [lesson, mode]);

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
    onComplete({ ...finalStats, errorKeys });
  };

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
    }
    
    setTimeout(() => setPressedKey(null), 100);
  };

  const getQwertyChar = (char: string) => {
    // Reverse simple mapping if they output proper bangla keys
    const nativeMap: Record<string, string> = {
      'অ': 'F', 'আ': 'f', 'ি': 'd', 'ী': 'D', 'ু': 's', 'ূ': 'S', 'ৃ': 'a', 'ে': 'c', 'ৈ': 'C', 'ো': 'x', 'ৌ': 'X',
      'ক': 'j', 'খ': 'J', 'গ': 'o', 'ঘ': 'O', 'ঙ': 'q', 'চ': 'y', 'ছ': 'Y', 'জ': 'u', 'ঝ': 'U', 'ঞ': 'I',
      'ট': 't', 'ঠ': 'T', 'ড': 'e', 'ঢ': 'E', 'ণ': 'w', 'ত': 'k', 'থ': 'K', 'দ': 'l', 'ধ': 'L', 'ন': 'b',
      'প': 'r', 'ফ': 'R', 'ব': 'h', 'ভ': 'H', 'ম': 'm', 'য': 'W', 'র': 'v', 'ল': 'V', 'শ': 'M', 'ষ': 'N', 'স': 'n', 'হ': 'i',
      'ড়': 'p', 'ঢ়': 'P', 'য়': 'z', 'ৎ': 'Z', 'ং': 'B', 'ঃ': ':', 'ঁ': '^', '্': 'g', '।': 'G'
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

  return (
    <div 
      className="flex flex-col gap-6 w-full max-w-5xl mx-auto focus:outline-none" 
      onClick={() => inputRef.current?.focus()}
    >
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-serif">{lesson.title}</h2>
            <span className={cn(
              "px-2 py-0.5 rounded text-xs font-bold uppercase",
              mode === 'exam' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
              mode === 'challenge' ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
              "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            )}>
              {mode === 'exam' ? 'এক্সাম মোড' : mode === 'challenge' ? 'চ্যালেঞ্জ মোড' : 'প্র্যাকটিস'}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{lesson.description}</p>
        </div>
        <button 
          onClick={reset}
          className="mt-3 sm:mt-0 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg transition-colors border border-blue-200 dark:border-blue-800 flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> পুনরায় শুরু
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBox label="শব্দ / মিনিট (WPM)" value={stats.wpm} icon={<Activity className="w-5 h-5 opacity-60" />} />
        <StatBox label="সঠিক (Accuracy)" value={`${stats.accuracy}%`} icon={<Target className="w-5 h-5 opacity-60" />} />
        <StatBox label="ভুল (Errors)" value={errors} icon={<AlertTriangle className="w-5 h-5 opacity-60" />} />
        <StatBox label="সময় (Time)" value={timeDisplay} icon={<Timer className="w-5 h-5 opacity-60" />} alert={mode === 'exam' && EXAM_TIME_LIMIT - currentTime <= 60} />
      </div>

      {/* Typing Area */}
      <div className="bg-white dark:bg-slate-800 flex-1 flex flex-col justify-center rounded-2xl border border-slate-200 dark:border-slate-700 p-8 md:p-12 shadow-sm relative min-h-[300px] overflow-hidden">
        {!startTime && !isFinished && (
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <Play className="w-16 h-16 text-emerald-500 mb-4 animate-pulse" />
            <p className="text-xl font-bold text-slate-800 dark:text-slate-200 font-serif">শুরু করতে টাইপ করুন</p>
          </div>
        )}
        
        {isFinished && (
          <div className="absolute inset-0 bg-blue-50/95 dark:bg-slate-800/95 z-20 flex flex-col items-center justify-center p-8 text-center border-t border-blue-200 dark:border-slate-700 backdrop-blur-md">
            <h3 className="text-3xl font-bold text-blue-800 dark:text-blue-400 mb-2 font-serif">লিসন সম্পন্ন!</h3>
            <p className="text-blue-600 dark:text-blue-300 font-medium mb-8">চমৎকার কাজ! নিচে আপনার ফলাফল দেওয়া হলো:</p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex flex-col items-center p-6 bg-white dark:bg-slate-700 rounded-2xl shadow-sm border border-blue-100 dark:border-slate-600 w-[140px]">
                <span className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold font-serif mb-2">WPM</span>
                <span className="text-5xl font-black text-blue-600 dark:text-blue-400">{stats.wpm}</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-white dark:bg-slate-700 rounded-2xl shadow-sm border border-blue-100 dark:border-slate-600 w-[140px]">
                <span className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold font-serif mb-2">সঠিকতা</span>
                <span className="text-5xl font-black text-emerald-600 dark:text-emerald-400">{stats.accuracy}%</span>
              </div>
            </div>
            
            {/* Mistake Analysis */}
            {Object.keys(errorKeys).length > 0 && (
              <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                <span className="text-slate-700 dark:text-slate-300 font-medium block mb-3 font-serif">আপনার দুর্বল জায়গা (Mistake Analysis):</span>
                <div className="flex gap-2 justify-center flex-wrap max-w-lg mx-auto">
                  {Object.entries(errorKeys)
                    .sort(([,a], [,b]) => Number(b) - Number(a))
                    .slice(0, 8)
                    .map(([key, count]) => (
                    <span key={key} className="px-3 py-1.5 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg font-mono font-bold text-lg whitespace-pre border border-red-200 dark:border-red-800">
                      {key === ' ' ? 'Space' : key} <span className="text-xs opacity-70 font-sans ml-1">({count} বার ভুল)</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
            <button onClick={reset} className="px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-full font-bold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg cursor-pointer">
              আবার প্র্যাকটিস করুন
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 justify-items-center w-full max-w-5xl mx-auto mb-10 font-serif">
          {lesson.words.map((word, wIdx) => {
            const isActive = wIdx === activeWordIndex;
            return (
              <div key={wIdx} className={cn("flex flex-col items-center transition-all", isActive ? "opacity-100 scale-110 relative z-10" : "opacity-40 scale-100")}>
                <div className="text-3xl lg:text-4xl leading-relaxed text-center tracking-wide text-slate-800 dark:text-slate-100 mb-3">{word.bangla}</div>
                <div className="flex text-2xl font-mono tracking-widest bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  {word.keys.split('').map((char, cIdx) => {
                    let absIdx = 0;
                    for (let i = 0; i < wIdx; i++) absIdx += lesson.words[i].keys.length + 1;
                    absIdx += cIdx;

                    const status = typedInputs[absIdx];
                    const isCurrent = absIdx === currentIndex;

                    return (
                      <span 
                        key={cIdx} 
                        className={cn(
                          "relative px-1 transition-all rounded",
                          status === 'correct' ? "text-green-600 bg-green-100 dark:bg-green-900/30" : 
                          status === 'wrong' ? "bg-red-500 text-white" : "text-slate-400 dark:text-slate-500",
                          isCurrent && "border-b-[3px] border-blue-500 text-blue-600 dark:text-blue-400 pb-0.5"
                        )}
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>
                {word.hint && (
                  <div className="mt-3 text-sm font-sans font-bold text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                    {word.hint}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Input area for typing */ !isFinished && (
          <div className="mt-8 max-w-lg mx-auto w-full">
            <label className="block text-center text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-2 font-sans">
              আপনার টাইপিং এখানে প্র্যাকটিস করুন:
            </label>
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
                }
                setInputValue(val);
              }}
              onKeyDown={handleKeyDown}
              className="w-full p-4 border-2 border-blue-400 dark:border-blue-600 bg-blue-50/50 dark:bg-slate-900 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/30 text-center text-3xl font-serif text-slate-800 dark:text-slate-100 placeholder:text-blue-300 dark:placeholder:text-slate-600 shadow-inner"
              placeholder="এখানে টাইপ করুন..."
            />
          </div>
        )}
      </div>

      <VirtualKeyboard 
        expectedKey={!isFinished ? fullKeysString[currentIndex] : null} 
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
  );
}

function StatBox({ label, value, icon, alert }: { label: string, value: string | number, icon: React.ReactNode, alert?: boolean }) {
  return (
    <div className={cn(
      "bg-white dark:bg-slate-800 p-4 rounded-xl border text-left shadow-sm flex items-center justify-between",
      alert ? "border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/20" : "border-slate-200 dark:border-slate-700"
    )}>
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1 font-serif">{label}</span>
        <span className={cn(
          "text-2xl font-bold block leading-none",
          alert ? "text-red-600 dark:text-red-400 animate-pulse" : "text-slate-800 dark:text-slate-100"
        )}>
          {value}
        </span>
      </div>
      <div className={alert ? "text-red-500" : "text-blue-500 dark:text-blue-400"}>
        {icon}
      </div>
    </div>
  );
}
