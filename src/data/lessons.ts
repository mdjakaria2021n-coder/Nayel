export interface LessonWord {
  keys: string;
  bangla: string;
  hint?: string;
}

export interface Lesson {
  id: string | number;
  title: string;
  level: string;
  description: string;
  words: LessonWord[];
}

const drill = (items: LessonWord[], repeats: number = 5): LessonWord[] => {
  const result: LessonWord[] = [];
  items.forEach(item => {
    for (let i = 0; i < repeats; i++) {
      result.push({ ...item });
    }
  });
  return result;
};

export const LESSONS: Lesson[] = [
  // GROUP 1 + 2 (া ি ে ক র ন ম ত হ)
  {
    id: '1-1',
    title: 'ধাপ ১-ক: অক্ষর (গ্রুপ ১+২)',
    level: 'Beginner',
    description: 'নতুন অক্ষর শিখুন: া ি ে ক র ন ম ত হ',
    words: drill([
      { keys: 'f', bangla: 'া' },
      { keys: 'd', bangla: 'ি' },
      { keys: 'c', bangla: 'ে' },
      { keys: 'j', bangla: 'ক' },
      { keys: 'v', bangla: 'র' },
      { keys: 'b', bangla: 'ন' },
      { keys: 'm', bangla: 'ম' },
      { keys: 'k', bangla: 'ত' },
      { keys: 'i', bangla: 'হ' }
    ], 10)
  },
  {
    id: '1-2',
    title: 'ধাপ ১-খ: শব্দ (গ্রুপ ১+২)',
    level: 'Beginner',
    description: 'শেখা অক্ষর দিয়ে শব্দ প্র্যাকটিস',
    words: drill([
      { keys: 'jvf', bangla: 'করা' },
      { keys: 'mvf', bangla: 'মরা' },
      { keys: 'bvm', bangla: 'নরম' },
      { keys: 'kfj', bangla: 'তাক' },
      { keys: 'vfk', bangla: 'রাত' },
      { keys: 'jfb', bangla: 'কান' },
      { keys: 'bfm', bangla: 'নাম' },
      { keys: 'ifk', bangla: 'হাত' },
      { keys: 'kfv', bangla: 'তার' },
      { keys: 'jfj', bangla: 'কাক' },
      { keys: 'mfb', bangla: 'মান' },
      { keys: 'vfm', bangla: 'রাম' },
      { keys: 'bfj', bangla: 'নাক' },
      { keys: 'jfm', bangla: 'কাম' },
      { keys: 'jdbc', bangla: 'কিনে' },
      { keys: 'ifkc', bangla: 'হাতে' },
      { keys: 'mcbc', bangla: 'মেনে' }
    ], 5)
  },
  {
    id: '1-3',
    title: 'ধাপ ১-গ: বাক্য (গ্রুপ ১+২)',
    level: 'Beginner',
    description: 'শেখা অক্ষর দিয়ে বাক্য প্র্যাকটিস',
    words: drill([
      { keys: 'kfv', bangla: 'তার' }, { keys: 'bfm', bangla: 'নাম' }, { keys: 'jfb', bangla: 'কান' },
      { keys: 'vfm', bangla: 'রাম' }, { keys: 'jfm', bangla: 'কাম' }, { keys: 'jvc', bangla: 'করে' },
      { keys: 'kfvf', bangla: 'তারা' }, { keys: 'vfkc', bangla: 'রাতে' }, { keys: 'jvc', bangla: 'করে' },
      { keys: 'ifkc', bangla: 'হাতে' }, { keys: 'kfv', bangla: 'তার' }, { keys: 'bfm', bangla: 'নাম' },
      { keys: 'ifk', bangla: 'হাত' }, { keys: 'kfv', bangla: 'তার' }, { keys: 'bvm', bangla: 'নরম' }
    ], 3)
  },

  // GROUP 3 + 4 (ু ূ ী ো ব ল গ দ স প)
  {
    id: '2-1',
    title: 'ধাপ ২-ক: অক্ষর (গ্রুপ ৩+৪)',
    level: 'Beginner',
    description: 'নতুন অক্ষর শিখুন: ু ূ ী ো ব ল গ দ স প',
    words: drill([
      { keys: 's', bangla: 'ু' },
      { keys: 'S', bangla: 'ূ' },
      { keys: 'D', bangla: 'ী' },
      { keys: 'x', bangla: 'ো' },
      { keys: 'h', bangla: 'ব' },
      { keys: 'V', bangla: 'ল' },
      { keys: 'o', bangla: 'গ' },
      { keys: 'l', bangla: 'দ' },
      { keys: 'n', bangla: 'স' },
      { keys: 'r', bangla: 'প' }
    ], 10)
  },
  {
    id: '2-2',
    title: 'ধাপ ২-খ: শব্দ (গ্রুপ ৩+৪)',
    level: 'Beginner',
    description: 'শেখা অক্ষর দিয়ে শব্দ',
    words: drill([
      { keys: 'ofb', bangla: 'গান' },
      { keys: 'ldb', bangla: 'দিন' },
      { keys: 'lflf', bangla: 'দাদা' },
      { keys: 'hfhf', bangla: 'বাবা' },
      { keys: 'rfV', bangla: 'পাল' },
      { keys: 'hnb', bangla: 'বসন' },
      { keys: 'rsV', bangla: 'পুল' },
      { keys: 'mfn', bangla: 'মাস' },
      { keys: 'ldld', bangla: 'দিদি' },
      { keys: 'oVf', bangla: 'গলা' },
      { keys: 'nxbf', bangla: 'সোনা' }
    ], 5)
  },
  {
    id: '2-3',
    title: 'ধাপ ২-গ: বাক্য (গ্রুপ ৩+৪)',
    level: 'Beginner',
    description: 'শেখা অক্ষর দিয়ে বাক্য',
    words: drill([
      { keys: 'lflf', bangla: 'দাদা' }, { keys: 'ofb', bangla: 'গান' }, { keys: 'jvc', bangla: 'করে' },
      { keys: 'hfhf', bangla: 'বাবা' }, { keys: 'rfV', bangla: 'পাল' }, { keys: 'ksVc', bangla: 'তুলে' },
      { keys: 'vfkc', bangla: 'রাতে' }, { keys: 'hnc', bangla: 'বসে' }, { keys: 'ofb', bangla: 'গান' },
      { keys: 'kfvf', bangla: 'তারা' }, { keys: 'rsV', bangla: 'পুল' }, { keys: 'rfv', bangla: 'পার' },
      { keys: 'lflf', bangla: 'দাদা' }, { keys: 'hxc', bangla: 'বোসে' }, { keys: 'kfcj', bangla: 'তাকে' }
    ], 3)
  },

  // GROUP 5 + 6 (অ আ ই উ এ ও খ ঘ ছ জ ট ঠ ড ধ ভ শ)
  {
    id: '3-1',
    title: 'ধাপ ৩-ক: স্বরবর্ণ ও অন্যান্য',
    level: 'Intermediate',
    description: 'অ আ ই উ এ ও খ ঘ ছ জ ট ঠ ড ধ ভ শ',
    words: drill([
      { keys: 'F', bangla: 'অ' }, { keys: 'gf', bangla: 'আ' }, { keys: 'gd', bangla: 'ই' },
      { keys: 'gs', bangla: 'উ' }, { keys: 'gc', bangla: 'এ' }, { keys: 'X', bangla: 'ও' },
      { keys: 'J', bangla: 'খ' }, { keys: 'O', bangla: 'ঘ' }, { keys: 'Y', bangla: 'ছ' },
      { keys: 'u', bangla: 'জ' }, { keys: 't', bangla: 'ট' }, { keys: 'T', bangla: 'ঠ' },
      { keys: 'e', bangla: 'ড' }, { keys: 'L', bangla: 'ধ' }, { keys: 'H', bangla: 'ভ' },
      { keys: 'M', bangla: 'শ' }
    ], 8)
  },
  {
    id: '3-2',
    title: 'ধাপ ৩-খ: শব্দ (গ্রুপ ৫+৬)',
    level: 'Intermediate',
    description: 'নতুন শেখা অক্ষর দিয়ে শব্দ',
    words: drill([
      { keys: 'gfjFM', bangla: 'আকাশ' },
      { keys: 'Jfhfv', bangla: 'খাবার' },
      { keys: 'Yfkf', bangla: 'ছাতা' },
      { keys: 'ufV', bangla: 'জাল' },
      { keys: 'tfjf', bangla: 'টাকা' },
      { keys: 'Tdj', bangla: 'ঠিক' },
      { keys: 'efj', bangla: 'ডাক' },
      { keys: 'Lfb', bangla: 'ধান' },
      { keys: 'Hfvx', bangla: 'ভালো' },
      { keys: 'gsmf', bangla: 'উমা' },
      { keys: 'gcjf', bangla: 'একা' },
      { keys: 'Xvf', bangla: 'ওরা' }
    ], 5)
  },
  {
    id: '3-3',
    title: 'ধাপ ৩-গ: বাক্য (গ্রুপ ৫+৬)',
    level: 'Intermediate',
    description: 'নতুন শেখা অক্ষর দিয়ে বাক্য',
    words: drill([
      { keys: 'Hfvx', bangla: 'ভালো' }, { keys: 'jfu', bangla: 'কাজ' }, { keys: 'jvc', bangla: 'করে' },
      { keys: 'tfjf', bangla: 'টাকা' }, { keys: 'vfJc', bangla: 'রাখে' }, { keys: 'ifkc', bangla: 'হাতে' },
      { keys: 'gfjFM', bangla: 'আকাশ' }, { keys: 'jfVx', bangla: 'কালো' }, { keys: 'gfu', bangla: 'আজ' },
      { keys: 'gsmf', bangla: 'উমা' }, { keys: 'Yfkf', bangla: 'ছাতা' }, { keys: 'Lvc', bangla: 'ধরে' }
    ], 3)
  },

  // GROUP 7 + 8 (ঙ চ ঝ ঞ ঢ ণ থ ফ য ষ ড় ঢ় য় ৎ ং ঁ ঃ ্)
  {
    id: '4-1',
    title: 'ধাপ ৪-ক: বাকি ব্যঞ্জন',
    level: 'Advanced',
    description: 'ঙ চ ঝ ঞ ঢ ণ থ ফ য ষ ড় ঢ় য় ৎ ং ঁ ঃ ্',
    words: drill([
      { keys: 'q', bangla: 'ঙ' }, { keys: 'y', bangla: 'চ' }, { keys: 'U', bangla: 'ঝ' },
      { keys: 'I', bangla: 'ঞ' }, { keys: 'E', bangla: 'ঢ' }, { keys: 'B', bangla: 'ণ' },
      { keys: 'K', bangla: 'থ' }, { keys: 'R', bangla: 'ফ' }, { keys: 'w', bangla: 'য' },
      { keys: 'N', bangla: 'ষ' }, { keys: 'p', bangla: 'ড়' }, { keys: 'P', bangla: 'ঢ়' },
      { keys: '&', bangla: 'য়' }, { keys: '\\', bangla: 'ৎ' }, { keys: '|', bangla: 'ং' },
      { keys: 'Q', bangla: 'ঁ' }, { keys: 'Z', bangla: 'ঃ' }, { keys: 'z', bangla: '্' }
    ], 8)
  },
  {
    id: '4-2',
    title: 'ধাপ ৪-খ: যুক্তাক্ষর',
    level: 'Advanced',
    description: 'যুক্তাক্ষর ও কঠিন শব্দ',
    words: drill([
      { keys: 'hjzkf', bangla: 'বক্তা' },
      { keys: 'Mfbzk', bangla: 'শান্ত' },
      { keys: 'jNzt', bangla: 'কষ্ট' },
      { keys: 'uzIb', bangla: 'জ্ঞান' },
      { keys: 'wsjzk', bangla: 'যুক্ত' },
      { keys: 'jzNm', bangla: 'ক্ষমা' },
      { keys: 'hf|VflcM', bangla: 'বাংলাদেশ' }
    ], 5)
  },
  {
    id: '4-3',
    title: 'ধাপ ৪-গ: পূর্ণাঙ্গ অনুচ্ছেদ',
    level: 'Mastery',
    description: 'সব মিলিয়ে পূর্ণাঙ্গ অনুচ্ছেদ',
    words: [
      { keys: 'gfmfv', bangla: 'আমার' },
      { keys: 'bfm', bangla: 'নাম' },
      { keys: 'mfbsN', bangla: 'মানুষ' },
      { keys: 'hf|VflcM', bangla: 'বাংলাদেশ' },
      { keys: 'gcjtd', bangla: 'একটি' },
      { keys: 'nsbzlv', bangla: 'সুন্দর' },
      { keys: 'lcM', bangla: 'দেশ' },
      { keys: 'gfmgvf', bangla: 'আমরা' },
      { keys: 'nhfF', bangla: 'সবাই' },
      { keys: 'hfgVf', bangla: 'বাংলা' },
      { keys: 'HfvNf&', bangla: 'ভাষায়' },
      { keys: 'jKf', bangla: 'কথা' },
      { keys: 'hvd', bangla: 'বলি' }
    ]
  }
];

export const COMMON_WORDS = [
  { keys: 'Ffmgv', bangla: 'আমার' },
  { keys: 'lcKf', bangla: 'দেখা' },
  { keys: 'jvf', bangla: 'কাল' },
  { keys: 'mff', bangla: 'মা' },
  { keys: 'hfhf', bangla: 'বাবা' }
];
