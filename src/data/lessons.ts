export interface LessonWord {
  keys: string;
  bangla: string;
  hint?: string;
}

export interface Lesson {
  id: number | string;
  title: string;
  level: string;
  description: string;
  words: LessonWord[];
}

const drill = (items: LessonWord[], repeats: number = 10): LessonWord[] => {
  const result: LessonWord[] = [];
  items.forEach(item => {
    for (let i = 0; i < Math.min(repeats, 10); i++) {
      result.push({ ...item });
    }
  });
  return result;
};

export const LESSONS: Lesson[] = [
  {
    id: 1,
    title: 'ধাপ ১: শুধু কার',
    level: 'Beginner',
    description: 'প্রতিটি কার ১০ বার করে সঠিকভাবে টাইপ করে Muscle Memory তৈরি করুন।',
    words: drill([
      { keys: 'f', bangla: 'া', hint: 'f' },
      { keys: 'd', bangla: 'ি', hint: 'd' },
      { keys: 'D', bangla: 'ী', hint: 'Shift+D' },
      { keys: 's', bangla: 'ু', hint: 's' },
      { keys: 'S', bangla: 'ূ', hint: 'Shift+S' },
      { keys: 'c', bangla: 'ে', hint: 'c' }
    ], 10)
  },
  {
    id: 2,
    title: 'ধাপ ২: সহজ ব্যঞ্জন',
    level: 'Beginner',
    description: 'সাধারণ ব্যঞ্জনবর্ণগুলো আয়ত্ত করুন।',
    words: drill([
      { keys: 'j', bangla: 'ক', hint: 'j' },
      { keys: 't', bangla: 'ত', hint: 't' },
      { keys: 'n', bangla: 'ন', hint: 'n' },
      { keys: 'r', bangla: 'র', hint: 'r' },
      { keys: 'm', bangla: 'ম', hint: 'm' },
      { keys: 'v', bangla: 'ল', hint: 'v' },
      { keys: 'b', bangla: 'ব', hint: 'b' }
    ], 10)
  },
  {
    id: 3,
    title: 'ধাপ ৩: ছোট শব্দ',
    level: 'Intermediate',
    description: 'কার ও ব্যঞ্জনবর্ণ মিলিয়ে ছোট শব্দ টাইপ করুন।',
    words: [
      ...drill([{ keys: 'jrf', bangla: 'করা' }], 5),
      ...drill([{ keys: 'bvf', bangla: 'বলা' }], 5),
      ...drill([{ keys: 'Wfx&f', bangla: 'যাওয়া' }], 5),
      ...drill([{ keys: 'gfnf', bangla: 'আসা' }], 5),
      ...drill([{ keys: 'lcKf', bangla: 'দেখা' }], 5),
      ...drill([{ keys: 'Mxfbf', bangla: 'শোনা' }], 5)
    ]
  },
  {
    id: 4,
    title: 'ধাপ ৪: স্বরবর্ণ',
    level: 'Intermediate',
    description: 'g ব্যবহার করে স্বরবর্ণ টাইপ করুন।',
    words: drill([
      { keys: 'F', bangla: 'অ', hint: 'Shift+F' },
      { keys: 'gf', bangla: 'আ', hint: 'g → f' },
      { keys: 'gd', bangla: 'ই', hint: 'g → d' },
      { keys: 'gD', bangla: 'ঈ', hint: 'g → Shift+D' },
      { keys: 'gs', bangla: 'উ', hint: 'g → s' },
      { keys: 'gS', bangla: 'ঊ', hint: 'g → Shift+S' },
      { keys: 'ga', bangla: 'ঋ', hint: 'g → a' },
      { keys: 'gc', bangla: 'এ', hint: 'g → c' },
      { keys: 'gC', bangla: 'ঐ', hint: 'g → Shift+C' },
      { keys: 'x', bangla: 'ও', hint: 'x' },
      { keys: 'gX', bangla: 'ঔ', hint: 'g → Shift+X' }
    ], 10)
  },
  {
    id: 5,
    title: 'ধাপ ৫: বাকি ব্যঞ্জন',
    level: 'Advanced',
    description: 'বাকি সব ব্যঞ্জনবর্ণগুলো শিখুন।',
    words: [
      { keys: 'J', bangla: 'খ' }, { keys: 'o', bangla: 'গ' }, { keys: 'O', bangla: 'ঘ' },
      { keys: 'q', bangla: 'ঙ' }, { keys: 'y', bangla: 'চ' }, { keys: 'Y', bangla: 'ছ' },
      { keys: 'u', bangla: 'জ' }, { keys: 'U', bangla: 'ঝ' }, { keys: 'I', bangla: 'ঞ' },
      { keys: 'E', bangla: 'ট' }, { keys: 'W', bangla: 'ঠ' }, { keys: 'B', bangla: 'ড' },
      { keys: 'N', bangla: 'ণ' }, { keys: 'T', bangla: 'থ' }, { keys: 'l', bangla: 'দ' },
      { keys: 'L', bangla: 'ধ' }, { keys: 'p', bangla: 'প' }, { keys: 'R', bangla: 'ফ' },
      { keys: 'H', bangla: 'ভ' }, { keys: 'M', bangla: 'শ' }, { keys: 'N', bangla: 'ষ' },
      { keys: 'i', bangla: 'হ' }, { keys: 'P', bangla: 'ড়' }, { keys: '|', bangla: 'ৎ' }
    ]
  },
  {
    id: 6,
    title: 'ধাপ ৬: যুক্তাক্ষর',
    level: 'Mastery',
    description: 'হসন্ত (z) ব্যবহার করে যুক্তাক্ষর তৈরি শিখুন।',
    words: drill([
      { keys: 'jzj', bangla: 'ক্ক', hint: 'j → z → j' },
      { keys: 'jzN', bangla: 'ক্ষ', hint: 'j → z → Shift+N' },
      { keys: 'jzt', bangla: 'ক্ত', hint: 'j → z → t' },
      { keys: 'uzI', bangla: 'জ্ঞ', hint: 'u → z → Shift+I' },
      { keys: 'tzr', bangla: 'ত্র', hint: 't → z → r' },
      { keys: 'nzt', bangla: 'ন্ত', hint: 'n → z → t' },
      { keys: 'nzl', bangla: 'ন্দ', hint: 'n → z → l' },
      { keys: 'nzL', bangla: 'ন্ধ', hint: 'n → z → Shift+L' },
      { keys: 'mzb', bangla: 'ম্ব', hint: 'm → z → b' },
      { keys: 'vzv', bangla: 'ল্ল', hint: 'v → z → v' }
    ], 5)
  }
];

export const COMMON_WORDS = [
  { keys: 'Ffmgv', bangla: 'আমার' },
  { keys: 'kSgm', bangla: 'তুমি' },
  { keys: 'nc', bangla: 'সে' },
  { keys: 'gfmgvf', bangla: 'আমরা' },
  { keys: 'nkfgvf', bangla: 'তোমরা' },
  { keys: 'kfvf', bangla: 'তারা' },
  { keys: 'jrf', bangla: 'করা' },
  { keys: 'bvf', bangla: 'বলা' },
  { keys: 'Wfx&f', bangla: 'যাওয়া' },
  { keys: 'gfnf', bangla: 'আসা' },
  { keys: 'lcKf', bangla: 'দেখা' },
  { keys: 'Mxfbf', bangla: 'শোনা' },
  { keys: 'hfoVflcM', bangla: 'বাংলাদেশ' },
  { keys: 'Bfj', bangla: 'ঢাকা' },
  { keys: 'nzkSjv', bangla: 'স্কুল' },
  { keys: 'hfP', bangla: 'বাড়ি' },
  { keys: 'cfbd', bangla: 'পানি' },
  { keys: 'Hfk', bangla: 'ভাত' },
  { keys: 'gfu', bangla: 'আজ' },
  { keys: 'jvf', bangla: 'কাল' },
  { keys: 'cKb', bangla: 'এখন' },
  { keys: 'kKb', bangla: 'তখন' },
  { keys: 'njv', bangla: 'সকাল' },
  { keys: 'bcjv', bangla: 'বিকাল' },
  { keys: 'mfcbxN', bangla: 'মানুষ' },
  { keys: 'lcM', bangla: 'দেশ' },
  { keys: 'HfvNf', bangla: 'ভাষা' },
  { keys: 'mff', bangla: 'মা' },
  { keys: 'hfhf', bangla: 'বাবা' },
  { keys: 'HfvFf', bangla: 'ভাই' },
  { keys: 'cfb', bangla: 'বোন' }
];
