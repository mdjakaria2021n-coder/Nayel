import React from 'react';

export default function JuktakkhorChart() {
  const JUKTAKKHORS = [
    { char: 'ক্ক', text: 'ক + ক', keys: 'j g j' },
    { char: 'ক্ষ', text: 'ক + ষ', keys: 'j g N' },
    { char: 'জ্ঞ', text: 'জ + ঞ', keys: 'u g I' },
    { char: 'ঞ্চ', text: 'ঞ + চ', keys: 'I g y' },
    { char: 'ঙ্গ', text: 'ঙ + গ', keys: 'q g o' },
    { char: 'ম্প', text: 'ম + প', keys: 'm g r' },
    { char: 'ন্ত', text: 'ন + ত', keys: 'b g k' },
    { char: 'ন্দ', text: 'ন + দ', keys: 'b g l' },
    { char: 'ষ্ক', text: 'ষ + ক', keys: 'N g j' },
    { char: 'স্থ', text: 'স + থ', keys: 'n g K' },
    { char: 'দ্ধ', text: 'দ + ধ', keys: 'l g L' },
    { char: 'শ্ম', text: 'শ + ম', keys: 'M g m' },
    { char: 'ম্ব', text: 'ম + ব', keys: 'm g h' },
    { char: 'ন্স', text: 'ন + স', keys: 'b g n' }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 font-serif text-center">যুক্তাক্ষর রেফারেন্স চার্ট</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {JUKTAKKHORS.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600">
            <span className="text-4xl text-blue-600 dark:text-blue-400 font-bold mb-2">{item.char}</span>
            <span className="text-sm text-slate-500 dark:text-slate-300 mb-2">{item.text}</span>
            <div className="flex gap-1 justify-center pointer-events-none">
              {item.keys.split(' ').map((key, i) => (
                <kbd key={i} className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 shadow-sm rounded text-xs font-mono font-bold text-slate-700 dark:text-slate-200">
                  {key}
                </kbd>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6 mt-4">
        * <strong>g</strong> হলো লিঙ্ক (Linker) key যা যুক্তাক্ষর তৈরি করতে ব্যবহৃত হয়।
      </p>
    </div>
  );
}
