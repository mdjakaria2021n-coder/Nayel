import React, { useState, useEffect } from 'react';
import { LESSONS, Lesson } from '../data/lessons';
import TypingEngine from './TypingEngine';
import JuktakkhorChart from './JuktakkhorChart';
import { useProgress } from '../hooks/useProgress';
import { Keyboard, BookOpen, GraduationCap, BarChart2, CheckCircle2, LayoutDashboard, Target, Activity, Moon, Sun, Volume2, VolumeX, Edit3, Play } from 'lucide-react';
import { cn } from '../lib/utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

type ViewMode = 'dashboard' | 'lesson' | 'juktakkhor';
type PlayMode = 'practice' | 'exam' | 'challenge';

export default function Dashboard() {
  const [activeView, setActiveView] = useState<ViewMode>('dashboard');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  
  // Settings
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [playMode, setPlayMode] = useState<PlayMode>('practice');
  const [customText, setCustomText] = useState('');

  // Progress
  const { history, saveResult, maxWpm } = useProgress();

  // Handle Dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLessonComplete = (stats: { wpm: number; accuracy: number; cpm: number }) => {
    saveResult({
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      mode: playMode
    });
  };

  const startCustomLesson = () => {
    if (!customText.trim()) return;
    
    // Auto-generate a primitive keys array from custom text (Warning: Bijoy encoding is complex, 
    // so we just split characters and let user practice natively without accurate keys mapping)
    // To keep the engine happy while allowing custom typing:
    const customLessonObj: Lesson = {
      id: 'custom',
      title: 'কাস্টম প্র্যাকটিস',
      level: 'Custom',
      description: 'আপনার নিজের দেওয়া লেখা টাইপ করুন।',
      words: customText.split(' ').filter(w => w).map(word => ({
        keys: word, // In custom mode, keys act as actual Bengali chars if typed from Avro, but we let them type Bijoy sequences
        bangla: word
      }))
    };
    setActiveLesson(customLessonObj);
    setActiveView('lesson');
  };

  // Safe chart data
  const chartData = history.slice(-10).map((h, i) => ({
    name: `Session ${i+1}`,
    wpm: h.wpm
  }));

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-slate-50 dark:bg-slate-900 transition-colors font-serif pb-20">
      
      {/* Navbar */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('dashboard')}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Keyboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Bijoy Bahanno</h1>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium tracking-wide font-sans uppercase">Typing Tutor PRO</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              title={soundEnabled ? "Mute Sounds" : "Enable Sounds"}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        
        {/* Navigation Tabs */}
        {activeView !== 'lesson' && (
          <div className="flex gap-4 mb-8 border-b border-slate-200 dark:border-slate-700 pb-1">
            <button 
              onClick={() => setActiveView('dashboard')}
              className={cn("pb-3 px-2 font-bold flex items-center gap-2 border-b-2 transition-colors", activeView === 'dashboard' ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400" : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200")}
            >
              <LayoutDashboard size={18} /> ড্যাশবোর্ড
            </button>
            <button 
              onClick={() => setActiveView('juktakkhor')}
              className={cn("pb-3 px-2 font-bold flex items-center gap-2 border-b-2 transition-colors", activeView === 'juktakkhor' ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400" : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200")}
            >
              <BookOpen size={18} /> যুক্তাক্ষর গাইড
            </button>
          </div>
        )}

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div className="grid lg:grid-cols-[1fr_350px] gap-8 animate-in fade-in duration-500">
            
            {/* Lessons Section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
                  <GraduationCap className="text-blue-500" /> কারিকুলাম ও লিসন
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6 font-sans">ধাপে ধাপে বিজয়ী কীবোর্ড টাইপিং শিখুন। প্রথমে প্র্যাকটিস মোডে হাত ক্লিয়ার করুন।</p>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {LESSONS.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => { setActiveLesson(lesson); setActiveView('lesson'); }}
                      className="group text-left p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all flex justify-between items-start"
                    >
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2 block font-sans">{lesson.level}</span>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{lesson.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{lesson.description}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900 shrink-0">
                        <Play className="w-4 h-4 text-slate-400 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 translate-x-0.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Target Content Box */}
              <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
                  <Edit3 size={20} className="text-emerald-500" /> কাস্টম প্র্যাকটিস লেসন
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-sans">আপনার নিজের পছন্দের Bijoy Sequence (e.g. Ffmgv nkvf) এখানে পেস্ট করে প্র্যাকটিস করুন।</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Type Bijoy sequence (e.g. jfj kfk)" 
                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-transparent dark:text-white font-mono"
                  />
                  <button onClick={startCustomLesson} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors font-sans whitespace-nowrap">
                    শুরু করুন
                  </button>
                </div>
              </div>

            </div>

            {/* Sidebar Settings & Stats */}
            <div className="space-y-6">
              
              {/* Mode Settings */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                  <Target className="w-5 h-5 text-purple-500" /> প্র্যাকটিস মোড নির্বাচন
                </h3>
                <div className="space-y-2">
                  <label className={cn("flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors", playMode === 'practice' ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50")}>
                    <input type="radio" checked={playMode === 'practice'} onChange={() => setPlayMode('practice')} className="hidden" />
                    <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center", playMode === 'practice' ? "border-blue-600" : "border-slate-300")}>
                      {playMode === 'practice' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">প্র্যাকটিস (Free Practice)</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">নিজে নিজের গতিতে শিখুন</div>
                    </div>
                  </label>
                  
                  <label className={cn("flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors", playMode === 'exam' ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50")}>
                    <input type="radio" checked={playMode === 'exam'} onChange={() => setPlayMode('exam')} className="hidden" />
                    <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center", playMode === 'exam' ? "border-red-600" : "border-slate-300")}>
                      {playMode === 'exam' && <div className="w-2 h-2 rounded-full bg-red-600" />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">এক্সাম মোড (5 Min Timer)</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">৫ মিনিটের টাইম-লিমিট পরীক্ষা</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Progress Chart */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                  <Activity className="w-5 h-5 text-emerald-500" /> আপনার অগ্রগতি (Progress)
                </h3>
                
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg border border-slate-100 dark:border-slate-600 text-center">
                    <span className="block text-xl font-bold text-emerald-600 dark:text-emerald-400">{maxWpm}</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Max WPM</span>
                  </div>
                  <div className="flex-1 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg border border-slate-100 dark:border-slate-600 text-center">
                    <span className="block text-xl font-bold text-blue-600 dark:text-blue-400">{history.length}</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Sessions</span>
                  </div>
                </div>

                <div className="h-[180px] w-full">
                  {history.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" hide />
                        <YAxis domain={['dataMin - 5', 'dataMax + 10']} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} width={30} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                          itemStyle={{ color: '#2563eb', fontWeight: 'bold' }}
                          labelStyle={{ display: 'none' }}
                        />
                        <Area type="monotone" dataKey="wpm" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorWpm)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-sm font-sans text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                      প্র্যাকটিস শুরু করলে চার্ট দেখাবে
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Lesson View */}
        {activeView === 'lesson' && activeLesson && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <button 
              onClick={() => setActiveView('dashboard')}
              className="mb-4 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 font-medium flex items-center gap-1 transition-colors"
            >
              ← ড্যাশবোর্ডে ফিরে যান
            </button>
            <TypingEngine 
              key={activeLesson.id + playMode} 
              lesson={activeLesson} 
              mode={playMode}
              soundEnabled={soundEnabled}
              onComplete={handleLessonComplete} 
            />
          </div>
        )}

        {/* Juktakkhor View */}
        {activeView === 'juktakkhor' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-4xl mx-auto">
             <JuktakkhorChart />
          </div>
        )}

      </div>
    </div>
  );
}
