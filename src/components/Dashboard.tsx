import React, { useState } from 'react';
import { LESSONS } from '../data/lessons';
import TypingEngine from './TypingEngine';
import { Keyboard, BookOpen, GraduationCap, BarChart2, CheckCircle2, LayoutDashboard, Target, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

type ViewMode = 'dashboard' | 'lesson';

export default function Dashboard() {
  const [view, setView] = useState<ViewMode>('dashboard');
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);

  type ProgressRecord = { wpm: number; accuracy: number; errorKeys: Record<string, number> };
  const [progress, setProgress] = useState<Record<number, ProgressRecord>>({
    1: { wpm: 24, accuracy: 98, errorKeys: {} },
    2: { wpm: 18, accuracy: 92, errorKeys: { 'r': 2 } }
  });

  const generateReviewLesson = () => {
    // Generate derived lesson from weak keys
    const allErrors: Record<string, number> = {};
    (Object.values(progress) as ProgressRecord[]).forEach(p => {
      Object.entries(p.errorKeys).forEach(([k, v]) => {
        allErrors[k] = (allErrors[k] || 0) + v;
      });
    });

    const weakKeys = Object.entries(allErrors)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(e => e[0]);

    if (weakKeys.length === 0) {
      alert("No weak keys detected yet! Keep practicing to generate a review lesson.");
      return;
    }

    // Simplistic mock generating
    const newLesson = {
      id: 999,
      title: 'Dynamic Review Lesson',
      level: 'Advanced',
      description: `Targeting your weak keys: ${weakKeys.join(', ')}`,
      words: weakKeys.map(k => ({ keys: k.repeat(3), bangla: '(Review)' }))
    };
    
    startLesson(newLesson.id);
  };

  const startLesson = (id: number) => {
    setActiveLessonId(id);
    setView('lesson');
  };

  const handleLessonComplete = (stats: any) => {
    if (activeLessonId && activeLessonId !== 999) {
      setProgress(prev => ({
        ...prev,
        [activeLessonId]: {
           wpm: Math.max(prev[activeLessonId]?.wpm || 0, stats.wpm),
           accuracy: Math.max(prev[activeLessonId]?.accuracy || 0, stats.accuracy),
           errorKeys: { ...prev[activeLessonId]?.errorKeys, ...stats.errorKeys }
        }
      }));
    }
  };

  const activeLesson = LESSONS.find(l => l.id === activeLessonId) || LESSONS[0];

  const progressValues = Object.values(progress) as ProgressRecord[];
  const overallAvgWpm = progressValues.length > 0 
    ? Math.round(progressValues.reduce((acc: number, p) => acc + (p.wpm || 0), 0) / progressValues.length)
    : 0;

  // Mock progress history for graph
  const mockHistory = [
    { name: 'Day 1', wpm: 12 },
    { name: 'Day 2', wpm: 15 },
    { name: 'Day 3', wpm: 18 },
    { name: 'Day 4', wpm: 22 },
    { name: 'Day 5', wpm: overallAvgWpm || 24 },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex flex-col md:flex-row text-[#1e293b] font-sans">
      
      {/* Sidebar */}
      <div className="w-full md:w-[260px] bg-[#ffffff] border-r border-[#e2e8f0] flex flex-col p-[24px] z-10 shrink-0">
        <div className="logo font-extrabold text-[20px] tracking-[-0.5px] text-[#2563eb] mb-[32px] flex items-center gap-[8px]">
          <Keyboard className="w-6 h-6" />
          BIJOY MASTER
        </div>

        <nav className="flex-1 flex flex-col gap-2 relative">
          <ul className="lesson-list list-none space-y-[8px]">
            <li>
              <button 
                onClick={() => setView('dashboard')}
                className={cn("w-full flex items-center justify-between px-[16px] py-[12px] rounded-[8px] text-[14px] font-medium transition-colors cursor-pointer", view === 'dashboard' ? "bg-[#2563eb] text-white" : "text-[#64748b] hover:bg-[#f1f5f9]")}
              >
                Dashboard
              </button>
            </li>
            {LESSONS.map(lesson => (
              <li key={lesson.id}>
                <button 
                  onClick={() => startLesson(lesson.id)}
                  className={cn(
                    "w-full text-left px-[16px] py-[12px] rounded-[8px] text-[14px] font-medium transition-colors cursor-pointer flex justify-between items-center",
                    view === 'lesson' && activeLessonId === lesson.id ? "bg-[#2563eb] text-white" : "text-[#64748b] hover:bg-[#f1f5f9]"
                  )}
                >
                  <span className="truncate">{lesson.title.split(':')[0]}</span>
                  <span className="text-xs">{progress[lesson.id] ? `${progress[lesson.id].accuracy}%` : '--'}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="mt-auto pt-6">
          <div className="text-[11px] uppercase tracking-[1px] text-[#64748b] mb-[8px]">Weak Keys</div>
          <div className="flex gap-[4px] flex-wrap">
            {Object.keys(progress).length > 0 ? (
               Object.keys(progress).map((keyId) => (
                 <span key={keyId} className="bg-[#fee2e2] text-[#b91c1c] px-[8px] py-[4px] rounded-[4px] text-[12px] font-bold">
                   Review Req
                 </span>
               )).slice(0, 2)
            ) : (
               <span className="text-[#64748b] text-xs">None yet</span>
            )}
          </div>
          <button onClick={generateReviewLesson} className="mt-4 w-full py-[8px] bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] hover:bg-[#bfdbfe] rounded-[8px] text-[13px] font-medium transition-colors cursor-pointer">
            Review Weak Keys
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-[32px] overflow-y-auto flex flex-col gap-[24px]">
        {view === 'dashboard' ? (
          <div className="max-w-5xl w-full mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-[20px]">
              <div className="bg-[#ffffff] p-[16px] rounded-[12px] border border-[#e2e8f0] text-center">
                <span className="text-[24px] font-bold text-[#1e293b] block">{overallAvgWpm}</span>
                <span className="text-[11px] uppercase tracking-[1px] text-[#64748b] mt-[4px] block">Avg WPM</span>
              </div>
              <div className="bg-[#ffffff] p-[16px] rounded-[12px] border border-[#e2e8f0] text-center">
                <span className="text-[24px] font-bold text-[#1e293b] block">
                  {progressValues.length ? Math.round(progressValues.reduce((acc: number, p) => acc + (p.accuracy || 0), 0) / progressValues.length) : 0}%
                </span>
                <span className="text-[11px] uppercase tracking-[1px] text-[#64748b] mt-[4px] block">Accuracy</span>
              </div>
              <div className="bg-[#ffffff] p-[16px] rounded-[12px] border border-[#e2e8f0] text-center">
                <span className="text-[24px] font-bold text-[#1e293b] block">{progressValues.length}</span>
                <span className="text-[11px] uppercase tracking-[1px] text-[#64748b] mt-[4px] block">Lessons</span>
              </div>
              <div className="bg-[#ffffff] p-[16px] rounded-[12px] border border-[#e2e8f0] text-center">
                <span className="text-[24px] font-bold text-[#1e293b] block">{LESSONS.length}</span>
                <span className="text-[11px] uppercase tracking-[1px] text-[#64748b] mt-[4px] block">Total Target</span>
              </div>
            </div>

            {/* Graph & Curriculum */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-slate-400" /> Performance Trend
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockHistory}>
                      <defs>
                        <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="wpm" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorWpm)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-slate-400" /> Next Lessons
                </h3>
                <div className="flex-1 space-y-4">
                  {LESSONS.filter(l => !progress[l.id]).slice(0,3).map(lesson => (
                    <div key={lesson.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200 transition-colors cursor-pointer" onClick={() => startLesson(lesson.id)}>
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-slate-800 text-sm">{lesson.title}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-white rounded text-slate-500 border border-slate-200 shadow-sm">{lesson.level}</span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">{lesson.description}</p>
                    </div>
                  ))}
                  {Object.keys(progress).length === LESSONS.length && (
                    <div className="text-center p-6 text-sm text-slate-500">
                      All lessons completed! Ready for a <button className="font-bold text-emerald-600 hover:underline">Skill Test</button>?
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <TypingEngine 
              key={activeLesson.id} 
              lesson={activeLesson as any} 
              onComplete={handleLessonComplete} 
            />
          </div>
        )}
      </main>
    </div>
  );
}
