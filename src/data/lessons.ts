export interface Lesson {
  id: string | number;
  title: string;
  level: string;
  description: string;
  words: { keys: string; bangla: string }[];
}

export const LESSONS: Lesson[] = [
  {
    id: 1,
    title: 'লেভেল ১: স্বরবর্ণ',
    level: 'Beginner',
    description: 'অ আ ই ঈ উ ঊ ঋ এ ঐ ও ঔ - স্বরবর্ণ শিখুন। (বিজয়ী কীবোর্ডের নিয়ম অনুযায়ী)',
    words: [
      { keys: 'F', bangla: 'অ' }, { keys: 'Ff', bangla: 'আ' }, { keys: 'gd', bangla: 'ই' },
      { keys: 'gD', bangla: 'ঈ' }, { keys: 'gs', bangla: 'উ' }, { keys: 'gS', bangla: 'ঊ' },
      { keys: 'ga', bangla: 'ঋ' }, { keys: 'gc', bangla: 'এ' }, { keys: 'gC', bangla: 'ঐ' },
      { keys: 'gx', bangla: 'ও' }, { keys: 'gX', bangla: 'ঔ' },
      { keys: 'F Ff gd', bangla: 'অ আ ই' }, { keys: 'gs gS ga', bangla: 'উ ঊ ঋ' }
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
      { keys: 'j o y u', bangla: 'ক গ চ জ' }, { keys: 'k l r h', bangla: 'ত দ প ব' }
    ]
  },
  {
    id: 3,
    title: 'লেভেল ৩: মাত্রা ও কার',
    level: 'Intermediate',
    description: 'আ-কার (া), ই-কার (ি), উ-কার (ু) ইত্যাদি যুক্ত করে শব্দ তৈরি।',
    words: [
      { keys: 'f', bangla: 'া' }, { keys: 'd', bangla: 'ি' }, { keys: 'D', bangla: 'ী' },
      { keys: 's', bangla: 'ু' }, { keys: 'S', bangla: 'ূ' }, { keys: 'a', bangla: 'ৃ' },
      { keys: 'c', bangla: 'ে' }, { keys: 'C', bangla: 'ৈ' }, { keys: 'cvf', bangla: 'রো' },
      { keys: 'jfj', bangla: 'কাক' }, { keys: 'kdk', bangla: 'তিত' }, { keys: 'jsj', bangla: 'কুক' },
      { keys: 'cjc', bangla: 'েকে' }
    ]
  },
  {
    id: 4,
    title: 'লেভেল ৪: সাধারণ শব্দ',
    level: 'Intermediate',
    description: 'বহুল ব্যবহৃত সাধারণ বাংলা শব্দসমূহ দ্রুত টাইপ করার প্র্যাকটিস।',
    words: [
      { keys: 'Ffmgv', bangla: 'আমার' }, { keys: 'bvf', bangla: 'নাম' }, { keys: 'hfvM', bangla: 'বাংলা' },
      { keys: 'kfv', bangla: 'তার' }, { keys: 'c`M', bangla: 'দেশ' }, { keys: 'hfv', bangla: 'বার' },
      { keys: 'Kfv', bangla: 'থার' }, { keys: 'vj', bangla: 'রদ' }, { keys: 'Kfc', bangla: 'থাকে' },
      { keys: 'yfv', bangla: 'চার' }, { keys: 'ofv', bangla: 'গার' }, { keys: 'dfv', bangla: 'দির' },
      { keys: 'cvj', bangla: 'রোদ' }
    ]
  },
  {
    id: 5,
    title: 'লেভেল ৫: যুক্তাক্ষর',
    level: 'Advanced',
    description: 'কঠিন ও সাধারণ যুক্তাক্ষরগুলোর (g ব্যবহার করে) অনুশীলন।',
    words: [
      { keys: 'jgN', bangla: 'ক্ষ' }, { keys: 'ugI', bangla: 'জ্ঞ' }, { keys: 'jgj', bangla: 'ক্ক' },
      { keys: 'lgb', bangla: 'দ্ন' }, { keys: 'lgh', bangla: 'দ্ব' }, { keys: 'mgh', bangla: 'ম্ব' },
      { keys: 'qgo', bangla: 'ঙ্গ' }, { keys: 'Igu', bangla: 'ঞ্জ' }, { keys: 'Njk', bangla: 'ষত' },
      { keys: 'ngK', bangla: 'স্থ' }, { keys: 'lghf', bangla: 'দ্ধা' }, { keys: 'Mgm', bangla: 'শ্ম' }
    ]
  },
  {
    id: 6,
    title: 'লেভেল ৬: পূর্ণ বাক্য (সাহিত্যিক)',
    level: 'Exam',
    description: 'পুরো ব্যাকরণ এবং শব্দ মিলিয়ে লম্বা বাক্য টাইপ করার চূড়ান্ত পরীক্ষা।',
    words: [
      { keys: 'Ffmgv', bangla: 'আমার' }, { keys: 'nxfbvfV', bangla: 'সোনার' }, { keys: 'hfvMvf', bangla: 'বাংলা' },
      { keys: 'Ffmg', bangla: 'আমি' }, { keys: 'nkfgvfC', bangla: 'তোমায়' }, { keys: 'Hfvnvhfnc', bangla: 'ভালোবাসি' },
      { keys: 'jgNfv', bangla: 'ক্ষীর' }, { keys: 'bglx', bangla: 'নদী' }, { keys: 'ugIfb', bangla: 'জ্ঞান' },
      { keys: 'Ffb', bangla: 'আন' }
    ]
  }
];
