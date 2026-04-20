export interface Lesson {
  id: string | number;
  title: string;
  level: string;
  description: string;
  words: { keys: string; bangla: string; hint?: string }[];
}

export const LESSONS: Lesson[] = [
  {
    id: 1,
    title: 'লেভেল ১: স্বরবর্ণ',
    level: 'Beginner',
    description: 'আপনার দেওয়া চার্ট অনুযায়ী স্বরবর্ণ প্র্যাকটিস।',
    words: [
      { keys: 'F', bangla: 'অ', hint: 'Shift+F' },
      { keys: 'gf', bangla: 'আ', hint: 'g → f' },
      { keys: 'gd', bangla: 'ই', hint: 'g → d' },
      { keys: 'gD', bangla: 'ঈ', hint: 'g → Shift+D' },
      { keys: 'gs', bangla: 'উ', hint: 'g → s' },
      { keys: 'gS', bangla: 'ঊ', hint: 'g → Shift+S' },
      { keys: 'ga', bangla: 'ঋ', hint: 'g → a' },
      { keys: 'gc', bangla: 'এ', hint: 'g → c' },
      { keys: 'gC', bangla: 'ঐ', hint: 'g → Shift+C' },
      { keys: 'x', bangla: 'ও', hint: 'x key' },
      { keys: 'gX', bangla: 'ঔ', hint: 'g → Shift+X' }
    ]
  },
  {
    id: 2,
    title: 'লেভেল ২: ব্যঞ্জনবর্ণ',
    level: 'Beginner',
    description: 'ক থেকে হ পর্যন্ত সাধারণ ব্যঞ্জনবর্ণের অনুশীলন।',
    words: [
      { keys: 'j', bangla: 'ক' }, { keys: 'J', bangla: 'খ' }, { keys: 'o', bangla: 'গ' }, 
      { keys: 'O', bangla: 'ঘ' }, { keys: 'q', bangla: 'ঙ' },
      { keys: 'y', bangla: 'চ' }, { keys: 'Y', bangla: 'ছ' }, { keys: 'u', bangla: 'জ' },
      { keys: 'U', bangla: 'ঝ' }, { keys: 'I', bangla: 'ঞ' },
      { keys: 'k', bangla: 'ত' }, { keys: 'K', bangla: 'থ' }, { keys: 'l', bangla: 'দ' },
      { keys: 'L', bangla: 'ধ' }, { keys: 'b', bangla: 'ন' },
      { keys: 'r', bangla: 'প' }, { keys: 'R', bangla: 'ফ' }, { keys: 'h', bangla: 'ব' },
      { keys: 'H', bangla: 'ভ' }, { keys: 'm', bangla: 'ম' },
      { keys: 'W', bangla: 'য' }, { keys: 'v', bangla: 'র' }, { keys: 'V', bangla: 'ল' },
      { keys: 'M', bangla: 'শ' }, { keys: 'N', bangla: 'ষ' }, { keys: 'n', bangla: 'স' },
      { keys: 'i', bangla: 'হ' }
    ]
  },
  {
    id: 3,
    title: 'লেভেল ৩: মাত্রা ও কার',
    level: 'Intermediate',
    description: 'আ-কার (া), ই-কার (ি) সহ আপনার চার্টের মাত্রাসমূহ।',
    words: [
      { keys: 'f', bangla: 'া', hint: 'f key' }, 
      { keys: 'd', bangla: 'ি', hint: 'd key' }, 
      { keys: 'D', bangla: 'ী', hint: 'Shift+D' },
      { keys: 's', bangla: 'ু', hint: 's key' }, 
      { keys: 'S', bangla: 'ূ', hint: 'Shift+S' }, 
      { keys: 'a', bangla: 'ৃ', hint: 'a key' },
      { keys: 'c', bangla: 'ে', hint: 'c key' }, 
      { keys: 'C', bangla: 'ৈ', hint: 'Shift+C' }, 
      { keys: 'x', bangla: 'ো', hint: 'x key' }, 
      { keys: 'X', bangla: 'ৌ', hint: 'Shift+X' },
      { keys: 'g', bangla: 'ং', hint: 'g' }, 
      { keys: 'Z', bangla: 'ঃ', hint: 'Shift+Z' }, 
      { keys: 'z', bangla: '্', hint: 'z' }, 
      { keys: 'A', bangla: 'ঁ', hint: 'Shift+A' }
    ]
  },
  {
    id: 4,
    title: 'লেভেল ৪: সাধারণ শব্দ',
    level: 'Intermediate',
    description: 'বহুল ব্যবহৃত সাধারণ বাংলা শব্দসমূহ দ্রুত টাইপ করার প্র্যাকটিস।',
    words: [
      { keys: 'gfmvf', bangla: 'আমার' }, { keys: 'bvf', bangla: 'নাম' }, { keys: 'hfvM', bangla: 'বাংলা' },
      { keys: 'kfv', bangla: 'তার' }, { keys: 'c`M', bangla: 'দেশ' }, { keys: 'hfv', bangla: 'বার' },
      { keys: 'yfv', bangla: 'চার' }, { keys: 'dfv', bangla: 'দির' }, { keys: 'jxj', bangla: 'কোক' }
    ]
  },
  {
    id: 5,
    title: 'লেভেল ৫: যুক্তাক্ষর',
    level: 'Advanced',
    description: 'হসন্ত (z) ব্যবহার করে যুক্তাক্ষর তৈরি। (z = ্)',
    words: [
      { keys: 'jzN', bangla: 'ক্ষ', hint: 'j → z → N' }, 
      { keys: 'uzI', bangla: 'জ্ঞ', hint: 'u → z → I' }, 
      { keys: 'jzj', bangla: 'ক্ক', hint: 'j → z → j' },
      { keys: 'lzb', bangla: 'দ্ন', hint: 'l → z → b' }, 
      { keys: 'lzh', bangla: 'দ্ব', hint: 'l → z → h' }, 
      { keys: 'mzh', bangla: 'ম্ব', hint: 'm → z → h' },
      { keys: 'qzo', bangla: 'ঙ্গ', hint: 'q → z → o' }, 
      { keys: 'Izu', bangla: 'ঞ্জ', hint: 'I → z → u' }, 
      { keys: 'nzK', bangla: 'স্থ', hint: 'n → z → K' }
    ]
  },
  {
    id: 6,
    title: 'লেভেল ৬: পূর্ণ বাক্য',
    level: 'Exam',
    description: 'পুরো ব্যাকরণ এবং শব্দ মিলিয়ে বাংলা বাক্য টাইপ।',
    words: [
      { keys: 'gfmvf', bangla: 'আমার' }, { keys: 'nxfbvfV', bangla: 'সোনার' }, { keys: 'hfvMvf', bangla: 'বাংলা' },
      { keys: 'gfm', bangla: 'আমি' }, { keys: 'nkfgvfC', bangla: 'তোমায়' }, { keys: 'Hfvnvhfnc', bangla: 'ভালোবাসি' }
    ]
  }
];
