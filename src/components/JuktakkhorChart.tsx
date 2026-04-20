import React from 'react';

export default function JuktakkhorChart() {
  const JUKTAKKHORS = [
    { char: 'ক্ক', text: 'ক + ক', keys: 'j + z + j' },
    { char: 'ক্ষ', text: 'ক + ষ', keys: 'j + z + N' },
    { char: 'জ্ঞ', text: 'জ + ঞ', keys: 'u + z + I' },
    { char: 'ঞ্চ', text: 'ঞ + চ', keys: 'I + z + y' },
    { char: 'ঙ্গ', text: 'ঙ + গ', keys: 'q + z + o' },
    { char: 'ম্প', text: 'ম + প', keys: 'm + z + r' },
    { char: 'ন্ত', text: 'ন + ত', keys: 'b + z + k' },
    { char: 'ন্দ', text: 'ন + দ', keys: 'b + z + l' },
    { char: 'ষ্ক', text: 'ষ + ক', keys: 'N + z + j' },
    { char: 'স্থ', text: 'স + থ', keys: 'n + z + K' },
    { char: 'দ্ধ', text: 'দ + ধ', keys: 'l + z + L' },
    { char: 'শ্ম', text: 'শ + ম', keys: 'M + z + m' },
    { char: 'ম্ব', text: 'ম + ব', keys: 'm + z + h' },
    { char: 'ন্স', text: 'ন + স', keys: 'b + z + n' }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 font-serif text-center">যুক্তাক্ষর রেফারেন্স চার্ট</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {JUKTAKKHORS.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600">
            <span className="text-4xl text-blue-600 dark:text-blue-400 font-bold mb-2">{item.char}</span>
            <span className="text-sm text-slate-500 dark:text-slate-300 mb-2">{item.text}</span>
            <div className="flex gap-1 justify-center pointer-events-none items-center">
              {item.keys.split(' ').map((val, i) => val === '+' ? (
                <span key={i} className="text-slate-400 font-bold mx-1">+</span>
              ) : (
                <kbd key={i} className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 shadow-sm rounded text-xs font-mono font-bold text-slate-700 dark:text-slate-200">
                  {val}
                </kbd>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6 mt-4">
        * <strong>z</strong> হলো লিঙ্ক (Hasant/হসন্ত) key যা যুক্তাক্ষর তৈরি করতে ব্যবহৃত হয় (আপনার চার্ট অনুযায়ী)।
      </p>
    </div>
  );
}
